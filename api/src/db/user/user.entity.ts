import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subjects/subject.entity";
import { Slots } from "../slots/slots.entity";
import { SlotsLock } from "../slots-lock/slots-lock.entity";
import { Messages } from "../messages/messages.entity";

export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

export enum UserSex {
    MALE="male",
    FEMALE="female"
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

    @Column({ type: "bool", default: true })
    isAvailableForPermanentSessions!: boolean;

    @Column({ nullable: true, type: "varchar" })
    language!: string | null;

    @Column({ nullable: true, type: "varchar" })
    avatarFilename!: string | null;

    @Column({ nullable: false, default: 18 })
    age!: number;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Column({ type: "enum", enum: UserSex, default: UserSex.MALE })
    sex!: UserSex;

    @OneToMany(() => Subject, (subject: Subject) => subject.user)
    subjects?: Subject[];

    @OneToMany(() => Slots, (slot: Slots) => slot.user)
    slots?: Slots[];

    @OneToMany(() => SlotsLock, (slotsLock: SlotsLock) => slotsLock.user)
    slotsLock?: SlotsLock[]; 

    @OneToMany(() => Messages, (messages: Messages) => messages.user)
    messages?: Messages[];
}

