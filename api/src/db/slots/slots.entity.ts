import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Subject } from "../subjects/subject.entity";
import { SlotsTemplates } from "../slots-templates/slots-templates.entity";
import { Sessions } from "../sessions/sessions.entity";

@Entity()
export class Slots {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "datetime" })
    startTime!: Date | string;

    @Column({ type: "datetime" })
    endTime!: Date | string;

    @Column()
    userId!: number;

    @Column()
    subjectId!: number;

    @Column({ nullable: true })
    slotsTemplateId!: number | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Subject, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "subjectId" })
    subject!: Subject;

    @ManyToOne(() => SlotsTemplates, { nullable: true, onDelete: "SET NULL", onUpdate: "CASCADE" })
    @JoinColumn({ name: "slotsTemplateId" })
    slotsTemplate!: SlotsTemplates;

    @OneToOne(() => Sessions, (session) => session.slot)
    session!: Sessions;
}

