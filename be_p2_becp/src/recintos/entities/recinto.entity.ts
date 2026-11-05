
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('recintos')
export class Recinto {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  ciudad: string;

  @Column({ type: 'integer', nullable: true })
  aforo_maximo: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fecha_modificacion: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  fecha_eliminacion: Date;
}
