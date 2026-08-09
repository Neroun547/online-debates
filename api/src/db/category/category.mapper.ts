import { Category } from "./category.entity";
import { CategoryDomainInterface, CategoryInterface } from "./interfaces/category.interfaces";

export class CategoryMapper {
    static toDomain(model: Category): CategoryDomainInterface {
        return {
            id: model.id,
            name: model.name,
            priority: model.priority
        }
    }

    static toSave(data: CategoryInterface): Category {
        const newModel = new Category();

        newModel.name = data.name;
        newModel.priority = data.priority;

        return newModel;
    }
}

