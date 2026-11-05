import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { EventosCulturalesService } from './eventos-culturales.service';
import { CreateEventosCulturaleDto } from './dto/create-eventos-culturale.dto';
import { UpdateEventosCulturaleDto } from './dto/update-eventos-culturale.dto';

@Controller('eventos-culturales')
export class EventosCulturalesController {

  constructor(
    private readonly eventosService: EventosCulturalesService,
  ) {}

  @Post()
  create(@Body() dto: CreateEventosCulturaleDto) {
    return this.eventosService.create(dto);
  }

  @Get()
  findAll() {
    return this.eventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventosCulturaleDto,
  ) {
    return this.eventosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}