import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subjects/subject.entity";
import { Slots } from "../slots/slots.entity";

export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column({ type: "varchar", unique: true })
    username!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;
    
    @Column({ type: "bool" })
    isConfirmed!: boolean;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.OFFLINE
    })
    status!: UserStatus;

    @Column({ type: "varchar", length: 50, nullable: true })
    timezone!: string;

    @OneToMany(() => Subject, (subject: Subject) => subject.user)
    subjects?: Subject[];

    @OneToMany(() => Slots, (slot: Slots) => slot.user)
    slots?: Slots[];
}

