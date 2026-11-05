
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventosCulturale } from './entities/eventos-culturale.entity';
import { CreateEventosCulturaleDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventosCulturaleDto } from './dto/update-eventos-culturale.dto';

@Injectable()
export class EventosCulturalesService {
  constructor(
    @InjectRepository(EventosCulturale)
    private eventosRepository: Repository<EventosCulturale>,
  ) {}

  create(dto: CreateEventosCulturaleDto) {
    const evento = this.eventosRepository.create(dto);
    return this.eventosRepository.save(evento);
  }

  findAll() {
    return this.eventosRepository.find({
      relations: {
        recinto: true,
      },
      order: {
        fecha_evento: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: {
        recinto: true,
      },
    });

    if (!evento) {
      throw new NotFoundException('Evento cultural no encontrado');
    }

    return evento;
  }

  async update(id: number, dto: UpdateEventosCulturaleDto) {
    const evento = await this.findOne(id);
    Object.assign(evento, dto);
    return this.eventosRepository.save(evento);
  }

  async remove(id: number) {
    const evento = await this.findOne(id);
    await this.eventosRepository.softRemove(evento);

    return { mensaje: 'Evento eliminado correctamente' };
  }
}
