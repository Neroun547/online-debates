import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Slots } from "../slots/slots.entity";

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
    
    @OneToOne(() => Slots, (slot) => slot.id)
    @JoinColumn({ name: "slotId" })
    slot!: Slots;
}

