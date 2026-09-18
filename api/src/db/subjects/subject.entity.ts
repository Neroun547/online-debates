import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Category } from "../category/category.entity";
import { SlotsLock } from "../slots-lock/slots-lock.entity";
import { Sessions } from "../sessions/sessions.entity";

@Entity({ name: "subjects" })
export class Subject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 500 })
    name!: string;

    @Column()
    categoryId!: number;
    
    @Column({ nullable: true })
    userId!: number | null;

    @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Category, (category) => category.subjects, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "categoryId" })
    category!: Category;

    @OneToMany(() => SlotsLock, (slotsLock) => slotsLock.subject)
    slotsLock!: SlotsLock[];

    @OneToMany(() => Sessions, (sessions) => sessions.subject)
    sessions!: Sessions[];
}

