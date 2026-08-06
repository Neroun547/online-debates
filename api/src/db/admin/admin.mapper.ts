import { Admin } from "./admin.entity";
import { AdminDomainInterface, AdminDomainInterfaceWithSecureParams, AdminInterface } from "./interfaces/admin.interfaces";

export class AdminMapper {
    static toDomain(data: Admin): AdminDomainInterface {
        return {
            id: data.id,
            email: data.email
        }; 
    }

    static toDomainWithSecureParams(data: Admin): AdminDomainInterfaceWithSecureParams {
        return {
            id: data.id,
            email: data.email,
            password: data.password
        }
    }

    static toSave(data: AdminInterface): Admin {
        const model = new Admin(data.email, data.password);

        return model;
    }
}

