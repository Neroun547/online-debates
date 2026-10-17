import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Subject } from "../subjects/subject.entity";

@Entity()
export class SlotsTemplates {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "smallint" })
    weekday!: number;

    @Column({ type: "varchar", length: 20 })
    startTime!: string;

    @Column({ type: "varchar", length: 20 })
    endTime!: string;

    @Column()
    userId!: number;

    @Column()
    subjectId!: number;

    @Column({ type: "datetime" })
    lastSlotCreation!: Date;

    @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    user!: User;

    @ManyToOne(() => Subject, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    subject!: Subject;
}
