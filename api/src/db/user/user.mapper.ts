import { SubjectMapper } from "../subjects/subject.mapper";
import {
    UserDomainInterface,
    UserInterface,
    UserWithSecureParams,
} from "./interfaces/user.interfaces";
import { User } from "./user.entity";

export class UserMapper {
    static toDomain(user: User): UserDomainInterface {
        return {
            id: user.id ?? 0,
            email: user.email,
            username: user.username,
            status: user.status,
            timezone: user.timezone,
            language: user.language,
            isAvailableForPermanentSessions:
                user.isAvailableForPermanentSessions,
            avatarFilename: user.avatarFilename,
            age: user.age,
            description: user.description,
            subjects: user.subjects
                ? user.subjects.map((subject) =>
                      SubjectMapper.toDomain(subject),
                  )
                : undefined,
            sex: user.sex,
        };
    }
    static toDomainWithSecureParams(user: User): UserWithSecureParams {
        return {
            id: user.id ?? 0,
            email: user.email,
            username: user.username,
            isConfirmed: user.isConfirmed,
            password: user.password,
            status: user.status,
            timezone: user.timezone,
            language: user.language,
            avatarFilename: user.avatarFilename,
            isAvailableForPermanentSessions:
                user.isAvailableForPermanentSessions,
            age: user.age,
            description: user.description,
            subjects: user.subjects
                ? user.subjects.map((subject) =>
                      SubjectMapper.toDomain(subject),
                  )
                : undefined,
            sex: user.sex,
        };
    }
    static toSave(user: UserInterface): User {
        const model = new User();

        if (user.id) {
            model.id = user.id;
        }
        model.username = user.username;
        model.email = user.email;
        model.password = user.password;
        model.isConfirmed = user.isConfirmed;
        model.status = user.status;
        model.timezone = user.timezone;
        model.language = user.language;
        model.avatarFilename = user.avatarFilename;
        model.description = user.description;
        model.age = user.age;
        model.sex = user.sex;

        return model;
    }
}
