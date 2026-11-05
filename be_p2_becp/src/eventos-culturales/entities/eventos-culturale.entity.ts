
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Recinto } from '../../recintos/entities/recinto.entity';

export enum EstadoEvento {
  PROGRAMADO = 'Programado',
  AGOTADO = 'Agotado',
  CANCELADO = 'Cancelado',
}

@Entity('eventos_culturales')
export class EventosCulturale {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_recinto: number;

  @ManyToOne(() => Recinto)
  @JoinColumn({ name: 'id_recinto' })
  recinto: Recinto;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'varchar', length: 100 })
  artista_principal: string;

  @Column({ type: 'integer' })
  duracion_minutos: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_entrada: number;

  @Column({ type: 'date' })
  fecha_evento: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: EstadoEvento.PROGRAMADO,
  })
  estado: EstadoEvento;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fecha_modificacion: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  fecha_eliminacion: Date;
}
