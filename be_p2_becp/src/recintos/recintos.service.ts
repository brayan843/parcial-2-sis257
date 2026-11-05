import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recinto } from './entities/recinto.entity';
import { CreateRecintoDto } from './dto/create-recinto.dto';
import { UpdateRecintoDto } from './dto/update-recinto.dto';

@Injectable()
export class RecintosService {

  constructor(
    @InjectRepository(Recinto)
    private recintoRepository: Repository<Recinto>,
  ) {}

  create(createRecintoDto: CreateRecintoDto) {
    const recinto = this.recintoRepository.create(createRecintoDto);
    return this.recintoRepository.save(recinto);
  }

  findAll() {
    return this.recintoRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const recinto = await this.recintoRepository.findOneBy({ id });

    if (!recinto) {
      throw new NotFoundException('Recinto no encontrado');
    }

    return recinto;
  }

  async update(id: number, updateRecintoDto: UpdateRecintoDto) {
    const recinto = await this.findOne(id);

    Object.assign(recinto, updateRecintoDto);

    return this.recintoRepository.save(recinto);
  }

  async remove(id: number) {
    const recinto = await this.findOne(id);

    await this.recintoRepository.softRemove(recinto);

    return { mensaje: 'Recinto eliminado correctamente' };
  }
}