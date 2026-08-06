import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subjects/subject.entity";

@Entity({ name: "categories" })
export class Category {
    constructor(name: string, priority: number, id?: number) {
        if(id) {
            this.id = id;
        }
        this.name = name;
        this.priority = priority;
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    name!: string;

    @Column({ type: "int" })
    priority!: number;

    @OneToMany(() => Subject, (subject: Subject) => subject.category, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    subjects?: Subject[];
}

