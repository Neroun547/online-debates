import { UserDomainInterface, UserInterface } from "./interfaces/user.interfaces";
import { User } from "./user.entity";

export class UserMapper {
    static toDomain(user: User): UserDomainInterface {
        return {
            id: user.id ?? 0,
            email: user.email,
            username: user.username,
            status: user.status,
            timezone: user.timezone,
            isAvailableForInstantMeeting: user.isAvailableForInstantMeeting
        }
    }
    static toDomainWithSecureParams(user: User): UserInterface {
        return {
            id: user.id ?? 0,
            email: user.email,
            username: user.username,
            isConfirmed: user.isConfirmed,
            password: user.password,
            status: user.status,
            timezone: user.timezone,
            isAvailableForInstantMeeting: user.isAvailableForInstantMeeting
        }
    }
    static toSave(user: UserInterface): User {
        const model = new User();

        if(user.id) {
            model.id = user.id;
        }
        model.username = user.username;
        model.email = user.email;
        model.password = user.password;
        model.isConfirmed = user.isConfirmed;
        model.status = user.status;
        model.timezone = user.timezone;

        return model;
    }
}

