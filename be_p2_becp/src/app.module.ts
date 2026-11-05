import 'dotenv/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RecintosModule } from './recintos/recintos.module';
import { EventosCulturalesModule } from './eventos-culturales/eventos-culturales.module';

import { Recinto } from './recintos/entities/recinto.entity';
import { EventosCulturale } from './eventos-culturales/entities/eventos-culturale.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'usrparcial2',
      password: process.env.DB_PASSWORD || '',
      database: 'parcial2_becp',
      entities: [Recinto, EventosCulturale],
      synchronize: false,
      logging: true,
    }),
    RecintosModule,
    EventosCulturalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}