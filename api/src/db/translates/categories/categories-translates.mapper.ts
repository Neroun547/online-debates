import { CategoriesTranslates } from "./categories-translates.entity";
import {
    CategoriesTranslatesDomainInterface,
    CategoriesTranslatesSaveInterface,
} from "./interfaces/categories-translates.interfaces";

export class CategoriesTranslatesMapper {
    static toDomain(
        model: CategoriesTranslates,
    ): CategoriesTranslatesDomainInterface {
        return {
            id: model.id,
            property: model.property,
            value: model.value,
            categoryId: model.categoryId,
            language: model.language,
        };
    }

    static toSave(
        data: CategoriesTranslatesSaveInterface,
    ): CategoriesTranslates {
        const model = new CategoriesTranslates();

        model.categoryId = data.categoryId;
        model.property = data.property;
        model.value = data.value;
        model.language = data.language;

        return model;
    }
}
