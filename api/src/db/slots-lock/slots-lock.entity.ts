import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Subject } from "../subjects/subject.entity";

@Entity({ name: "slots_lock" })
@Index('UQ_slots_lock_user_subject', ['userId', 'subjectId'], {
  unique: true
})
export class SlotsLock {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;
    
    @Column()
    subjectId!: number;

    @ManyToOne(() => User, (user: User) => user.slotsLock, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Subject, (subject: Subject) => subject.slotsLock, { onDelete: "CASCADE" })
    subject!: Subject; 
}

