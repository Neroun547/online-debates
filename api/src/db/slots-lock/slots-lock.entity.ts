import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Subject } from "../subjects/subject.entity";

@Entity({ name: "slots_lock" })
@Index("UQ_slots_lock_user_subject", ["userId", "subjectId"], {
    unique: true,
})
export class SlotsLock {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    userId!: number | null;

    @Column()
    subjectId!: number;

    @ManyToOne(() => User, (user: User) => user.slotsLock, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user!: User;

    @ManyToOne(() => Subject, (subject: Subject) => subject.slotsLock, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    subject!: Subject;
}
