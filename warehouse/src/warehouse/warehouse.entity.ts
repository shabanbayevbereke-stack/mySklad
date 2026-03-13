import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cargo } from './cargo.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  x: number;

  @Column({ type: 'numeric' })
  y: number;

  @Column({ type: 'numeric' })
  z: number;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @OneToMany(() => Cargo, (cargo) => cargo.warehouse)
  cargo: Cargo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
