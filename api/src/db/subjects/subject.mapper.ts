import { CategoryMapper } from "../category/category.mapper";
import { CategoryDomainInterface } from "../category/interfaces/category.interfaces";
import { UserDomainInterface } from "../user/interfaces/user.interfaces";
import { UserMapper } from "../user/user.mapper";
import { SubjectDomainInterface, SubjectInterface } from "./interfaces/subject.interfaces";
import { Subject } from "./subject.entity";

export class SubjectMapper {
    static toDomain(model: Subject): SubjectDomainInterface {
        let domainUser: UserDomainInterface | undefined = undefined;
        let domainCategory: CategoryDomainInterface | undefined = undefined;

        if(model.user) {
            domainUser = UserMapper.toDomain(model.user);
        }
        if(model.category) {
            domainCategory = CategoryMapper.toDomain(model.category);
        }
        return {
            id: model.id,
            categoryId: model.categoryId,
            name: model.name,
            userId: model.userId,
            user: domainUser,
            category: domainCategory
        }
    }

    static toSave(data: SubjectInterface): Subject {
        const model = new Subject();

        model.name = data.name;
        model.categoryId = data.categoryId;
        model.userId = data.userId;

        return model;
    }
}

