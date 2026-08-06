import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "admins" })
export class Admin {
    constructor(email: string, password: string, id?: number) {
        if(id) {
            this.id = id;
        }
        this.email = email;
        this.password = password;
    }

    @PrimaryGeneratedColumn()
    id!: number;
   
    @Column()
    email!: string;

    @Column()
    password!: string;
}

