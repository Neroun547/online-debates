import { Category } from "../../category/category.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

export enum CategoriesTranslatesPropertyNames {
    name = "name",
}

@Entity()
export class CategoriesTranslates {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ enum: CategoriesTranslatesPropertyNames })
    property!: CategoriesTranslatesPropertyNames;

    @Column({ type: "text" })
    value!: string;

    @Column()
    categoryId!: number;

    @Column()
    language!: string;

    @JoinColumn({ name: "categoryId" })
    @ManyToOne(() => Category, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    category!: Category;
}
