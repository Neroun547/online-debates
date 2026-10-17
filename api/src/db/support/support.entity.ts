import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "support" })
export class Support {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 300 })
    email!: string;

    @Column({ type: "varchar", length: 300 })
    subject!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "datetime" })
    createdAt!: Date | string;
}
