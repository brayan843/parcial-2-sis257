import { PartialType } from '@nestjs/mapped-types';
import { CreateEventosCulturaleDto } from './create-eventos-culturale.dto';

export class UpdateEventosCulturaleDto extends PartialType(CreateEventosCulturaleDto) {}