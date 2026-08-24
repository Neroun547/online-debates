import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Slots } from "../slots/slots.entity";
import { Messages } from "../messages/messages.entity";

export enum SessionsStatus {
    BOOKED = "booked",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

@Entity()
export class Sessions {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    slotId!: number;

    @Column({ 
        type: "enum",
        enum: SessionsStatus
    })
    status!: SessionsStatus;

    @Column()
    creatorId!: number;

    @Column()
    customerId!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "creatorId" })
    creator!: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "customerId" })
    customer!: User; 
    
    @OneToOne(() => Slots, (slot) => slot.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "slotId" })
    slot!: Slots;

    @OneToMany(() => Messages, (messages: Messages) => messages.session)
    messages!: Messages[];
}

