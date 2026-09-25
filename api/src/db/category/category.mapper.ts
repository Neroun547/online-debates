import { SubjectMapper } from "../subjects/subject.mapper";
import { CategoriesTranslatesMapper } from "../translates/categories/categories-translates.mapper";
import { Category } from "./category.entity";
import { CategoryDomainInterface, CategoryInterface } from "./interfaces/category.interfaces";

export class CategoryMapper {
    static toDomain(model: Category): CategoryDomainInterface {
        if(model.translates) {
            const translates = model.translates.map(item => CategoriesTranslatesMapper.toDomain(item));

            const translateNameEn = translates.find(item => item.language === "en");
            const translateNameUk = translates.find(item => item.language === "uk");
            const translateNameRu = translates.find(item => item.language === "ru");

            return {
                id: model.id,
                name: model.name,    
                priority: model.priority,
                translateNameEn: translateNameEn?.value,
                translateNameRu: translateNameRu?.value,
                translateNameUk: translateNameUk?.value,
                subjects: model.subjects ? model.subjects.map(item => SubjectMapper.toDomain(item)) : undefined,
            }
        } 
        return {
            id: model.id,
            name: model.name,
            priority: model.priority,
            subjects: model.subjects ? model.subjects.map(item => SubjectMapper.toDomain(item)) : undefined,
        }
    }

    static toSave(data: CategoryInterface): Category {
        const newModel = new Category();

        newModel.name = data.name;
        newModel.priority = data.priority;

        return newModel;
    }
}

