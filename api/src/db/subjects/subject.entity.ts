import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Category } from "../category/category.entity";

@Entity({ name: "subjects" })
export class Subject {
    constructor(name: string, categoryId: number, userId: number, id?: number) {
        if(id) {
            this.id = id;
        }
        this.name = name;
        this.categoryId = categoryId;
        this.userId = userId;
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    name!: string;

    @Column()
    categoryId!: number;
    
    @Column({ nullable: true })
    userId!: number;

    @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Category, (category) => category.subjects, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category!: Category;
}

