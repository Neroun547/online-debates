import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subjects/subject.entity";
import { CategoriesTranslates } from "../translates/categories/categories-translates.entity";

@Entity({ name: "categories" })
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    name!: string;

    @Column({ type: "int" })
    priority!: number;

    @OneToMany(() => Subject, (subject: Subject) => subject.category)
    subjects?: Subject[];

    @OneToMany(() => CategoriesTranslates, (translate: CategoriesTranslates) => translate.category)
    translates!: CategoriesTranslates[];
}

