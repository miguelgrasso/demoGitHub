import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plan')
export default class Plan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nombre: string;

    @CreateDateColumn()
    fec_creacion: Date;

    @UpdateDateColumn()
    fec_modificacion: Date;

    @Column({ type: 'char', length: '1', default: 'A', comment: 'A: ACTIVE, I: INACTIVE, D: DELETED' })
    estado: string;

}