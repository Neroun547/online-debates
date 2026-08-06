import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "../subjects/subject.entity";

export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @Column({ type: "varchar" })
    username!: string;

    @Column({ type: "varchar" })
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

    @OneToMany(() => Subject, (subject: Subject) => subject.user)
    subjects?: Subject[];
}

