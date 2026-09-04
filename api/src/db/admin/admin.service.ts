import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "./admin.entity";
import { Repository } from "typeorm";
import { AdminDomainInterface, AdminDomainInterfaceWithSecureParams, AdminInterface } from "./interfaces/admin.interfaces";
import { AdminMapper } from "./admin.mapper";

@Injectable()
export class AdminServiceDb {
    constructor(@InjectRepository(Admin) private repository: Repository<Admin>) {}
    
    async findById(id: number): Promise<AdminDomainInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if(!data) {
            return null;
        }
        return AdminMapper.toDomain(data);
    }
    async save(data: AdminInterface) {
        const model = AdminMapper.toSave(data);

        await this.repository.save(model);
    }
    async findByEmail(email: string): Promise<AdminDomainInterface | null> {
        const data = await this.repository.findOne({ where: { email: email } });

        if(!data) {
            return null;
        }
        return AdminMapper.toDomain(data);
    }
    async findByEmailWithSecureParams(email: string): Promise<AdminDomainInterfaceWithSecureParams | null> {
        const data = await this.repository.findOne({ where: { email: email } });

        if(!data) {
            return null;
        }
        return AdminMapper.toDomainWithSecureParams(data);
    }
}
