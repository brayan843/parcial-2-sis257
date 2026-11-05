import { Test, TestingModule } from '@nestjs/testing';
import { EventosCulturalesController } from './eventos-culturales.controller';
import { EventosCulturalesService } from './eventos-culturales.service';

describe('EventosCulturalesController', () => {
  let controller: EventosCulturalesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosCulturalesController],
      providers: [
        {
          provide: EventosCulturalesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EventosCulturalesController>(
      EventosCulturalesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});