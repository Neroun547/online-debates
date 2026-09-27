import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { EntityManager, Not, Repository, UpdateResult } from "typeorm";
import { UserMapper } from "./user.mapper";
import { UpdateUserInterface, UserDomainInterface, UserInterface } from "./interfaces/user.interfaces";
import { Slots } from "../slots/slots.entity";
import { parseStartTimeAndEndTimeForCustomer } from "src/slots/utils/utils";
import { SlotsMapper } from "../slots/slots.mapper";
import { DateTime } from "luxon";

@Injectable()
export class UserServiceDb {
    constructor(
        @InjectRepository(User) private repository: Repository<User>,
        private em: EntityManager
    ) {}

    async findByEmail(email: string): Promise<UserDomainInterface | null> {
        const data = await this.repository.findOne({ where: { email: email } });

        if(!data) {
            return null;
        }
        return UserMapper.toDomain(data);
    }
    async countAll() {
        return await this.repository.count();
    }
    async findWithSearchByUsername(params: {
        page: number;
        limit: number;
        searchUsername?: string;
    }) {
        if(params.searchUsername) {
            const data = await this.repository
                .createQueryBuilder("user")
                .limit(params.limit)
                .offset((params.page - 1) * params.limit)
                .where("user.username LIKE :searchUsername", { searchUsername: "%" + params.searchUsername + "%" })
                .getMany();

            return data.map(item => UserMapper.toDomain(item));
        } else {
            const data = await this.repository.find({ take: params.limit, skip: (params.page - 1) * params.limit });

            return data.map(item => UserMapper.toDomain(item));
        }
    }
    async existsById(id: number): Promise<boolean> {
        return await this.repository.exists({ where: { id: id } });
    }
    async findInSubject(subjectId: number, page: number, limit: number): Promise<UserDomainInterface[]> {
        const resultArr = await this.repository
            .createQueryBuilder("user")
            .where(queryBuilder => {
                const slotsInSubject = queryBuilder
                    .subQuery()
                    .select("1")
                    .from(Slots, "slot")
                    .where("slot.userId = user.id")
                    .andWhere("slot.subjectId = :subjectId")
                    .getQuery();

                return `EXISTS ${slotsInSubject}`;
            })
            .setParameter("subjectId", subjectId)
            .orderBy("user.id", "ASC")
            .take(limit)
            .skip((page - 1) * limit)
            .getMany();

        return resultArr.map(user => UserMapper.toDomain(user));
    }
    async findByUsernameAndNotId(username: string, userId: number): Promise<UserDomainInterface | null> {
        const data = await this.repository.findOne({ where: { username: username, id: Not(userId) } });

        if(!data) {
            return null;
        }
        return UserMapper.toDomain(data);
    }
    async findByEmailAndNotId(email: string, userId: number): Promise<UserDomainInterface | null> {
        const data = await this.repository.findOne({ where: { email: email, id: Not(userId) } });

        if(!data) {
            return null;
        }
        return UserMapper.toDomain(data);
    }
    async deleteById(userId: number) {
        await this.repository.delete({ id: userId });
    }
    async save(data: UserInterface): Promise<void> {
        const model = UserMapper.toSave(data);

        await this.repository.save(model);
    }
    async saveAndReturn(data: UserInterface): Promise<UserDomainInterface> {
        const savedUser = await this.repository.save(UserMapper.toSave(data));

        return UserMapper.toDomain(savedUser);
    }
    // Why in JavaScript or TypeScript don't have method overloading ? :(
    async findByEmailOrUsernameTwoSeparateParams(email: string, username: string): Promise<UserDomainInterface | null> {
        const data = await this.repository.findOne({ where: [ { email: email }, { username: username } ] });

        if(!data) {
            return null;
        }
        return UserMapper.toDomain(data);
    }
    async findByEmailOrUsernameWithSecureParams(emailOrUsername: string): Promise<UserInterface | null> {
        const data = await this.repository.findOne({ where: [{ email: emailOrUsername }, { username: emailOrUsername }] });

        if(!data) {
            return null;
        }
        return UserMapper.toDomainWithSecureParams(data);
    }
    async findById(id: number): Promise<UserDomainInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if(!data) {
            return null;
        }
        return UserMapper.toDomain(data);
    }

    async findByIdWithSecureParams(id: number): Promise<UserInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if(!data) {
            return null;
        }
        return UserMapper.toDomainWithSecureParams(data);
    }

    async updateById(id: number, data: UpdateUserInterface) {
        if(data.timezone) {
            return this.em.transaction("READ COMMITTED", async (tx) => {
                const allUserSlots = await tx
                    .createQueryBuilder(Slots, "slot")
                    .where("slot.userId = :userId", { userId: id })
                    .setLock("pessimistic_write")
                    .getMany();

                const userInDb = await tx.findOneOrFail(User, { where: { id: id } });
                const updatePromises: Array<Promise<UpdateResult>> = [];

                for(const slot of allUserSlots) {
                    const domainSlot = SlotsMapper.toDomain(slot);
                    const newTimes = parseStartTimeAndEndTimeForCustomer(
                        domainSlot.startTime, 
                        domainSlot.endTime, 
                        userInDb.timezone
                    );

                    const parsedNewStartTime = DateTime.fromFormat(newTimes.startTime, "yyyy-MM-dd HH:mm", { zone: data.timezone }).toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
                    const parsedNewEndTime = DateTime.fromFormat(newTimes.endTime, "yyyy-MM-dd HH:mm", { zone: data.timezone }).toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
  
                    updatePromises.push(
                        tx.update(
                            Slots, 
                            { id: slot.id },
                            { 
                              startTime: parsedNewStartTime, 
                              endTime: parsedNewEndTime 
                            }
                        )
                    );
                }
                await Promise.all(updatePromises);
                await tx.update(User, { id: id }, data);
            });
        } else {
            await this.repository.update({ id: id }, data);
        }
    }

    updateUserAvatar(userId: number, filename: string | null): Promise<string | null> {
        return this.em.transaction("READ COMMITTED", async (tx) => {
            const userInDb = await tx
                .createQueryBuilder(User, "user")
                .setLock("pessimistic_write")
                .where("user.id = :id", { id: userId })
                .getOne();

            if(!userInDb) {
                throw new NotFoundException({ message: "User not found" });
            }
            await tx.update(User, { id: userId }, { avatarFilename: filename });

            return userInDb.avatarFilename;
        });
    }
}

