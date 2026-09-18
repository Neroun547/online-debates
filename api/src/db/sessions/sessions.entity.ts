import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Slots } from "../slots/slots.entity";
import { Messages } from "../messages/messages.entity";
import { Subject } from "../subjects/subject.entity";

export enum SessionsStatus {
    BOOKED = "booked",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

@Entity()
export class Sessions {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    slotId!: number | null;

    @Column({ 
        type: "enum",
        enum: SessionsStatus
    })
    status!: SessionsStatus;

    @Column()
    creatorId!: number;

    @Column()
    customerId!: number;

    @Column({ type: "datetime" })
    createdAt!: Date | string;

    @Column({ nullable: true })
    subjectId!: number;

    @ManyToOne(() => Subject, { nullable: true })
    @JoinColumn({ name: "subjectId" })
    subject!: Subject;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "creatorId" })
    creator!: User;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "customerId" })
    customer!: User; 
    
    @OneToOne(() => Slots, (slot) => slot.id, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
    @JoinColumn({ name: "slotId" })
    slot!: Slots;

    @OneToMany(() => Messages, (messages: Messages) => messages.session)
    messages!: Messages[];
}

