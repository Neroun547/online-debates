import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserMapper } from "./user.mapper";
import { UpdateUserInterface, UserDomainInterface, UserInterface } from "./interfaces/user.interfaces";

@Injectable()
export class UserServiceDb {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

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


