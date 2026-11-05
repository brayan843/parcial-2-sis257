import { EstadoEvento } from '../entities/eventos-culturale.entity';

export class CreateEventosCulturaleDto {
  id_recinto: number;
  titulo: string;
  artista_principal: string;
  duracion_minutos: number;
  precio_entrada: number;
  fecha_evento: string;
  estado: EstadoEvento;
}