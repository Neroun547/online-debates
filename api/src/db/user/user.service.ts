import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Not, Repository } from "typeorm";
import { UserMapper } from "./user.mapper";
import { UpdateUserInterface, UserDomainInterface, UserInterface } from "./interfaces/user.interfaces";

@Injectable()
export class UserServiceDb {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    async findInSubject(subjectId: number, page: number, limit: number): Promise<UserDomainInterface[]> {
        const data = await this.repository.query(`SELECT * FROM users LEFT JOIN slots ON users.id = slots.userId WHERE slots.id IS NOT NULL AND slots.subjectId=${subjectId} LIMIT ${limit} OFFSET ${(page - 1) * limit};`);
        
        const map = new Map<number, UserDomainInterface>();

        for(const user of data) {
            if(!map.get(user.userId)) {
                map.set(user.userId, {
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    status: user.status,
                    timezone: user.timezone
                });
            }
        }
        const resultArr: Array<UserDomainInterface> = [];
        
        for(const [key, value] of map.entries()) {
            resultArr.push(value);
        }
        return resultArr;
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
    async saveAndReturn(data: User): Promise<UserDomainInterface> {
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
        await this.repository.update({ id: id }, data);
    }
}


