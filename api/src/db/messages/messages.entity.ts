import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sessions } from "../sessions/sessions.entity";
import { User } from "../user/user.entity";

@Entity({
    name: "messages"
})
export class Messages {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    senderId!: number;

    @Column()
    sessionId!: number;

    @Column({ type: "text" })
    content!: string;

    @Column({ type: "datetime" })
    createdAt!: Date | string;

    @JoinColumn({ name: "sessionId" })
    @ManyToOne(() => Sessions, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    session!: Sessions;

    @JoinColumn({ name: "senderId" })
    @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    user!: User;
}


