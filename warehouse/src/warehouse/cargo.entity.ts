import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum CargoType {
  CONTAINER = 'container',
  CARGO = 'cargo',
}

@Entity('cargo')
@Index(['warehouseId', 'guid'], { unique: true })
@Index(['warehouseId', 'x', 'y', 'z'])
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  guid: string;

  @Column({ type: 'integer' })
  @Index()
  warehouseId: number;

  @Column({
    type: 'enum',
    enum: CargoType,
  })
  type: CargoType;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  netWeight: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  packWeight: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalWeight: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxLoadWeight: number | null;

  @Column({ type: 'numeric' })
  sizeX: number;

  @Column({ type: 'numeric' })
  sizeY: number;

  @Column({ type: 'numeric' })
  sizeZ: number;

  @Column({ type: 'numeric', nullable: true })
  containSizeX: number | null;

  @Column({ type: 'numeric', nullable: true })
  containSizeY: number | null;

  @Column({ type: 'numeric', nullable: true })
  containSizeZ: number | null;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  transportNumber: string | null;

  @Column()
  storageDate: Date;

  @Column({ type: 'numeric' })
  x: number;

  @Column({ type: 'numeric' })
  y: number;

  @Column({ type: 'numeric' })
  z: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.cargo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
