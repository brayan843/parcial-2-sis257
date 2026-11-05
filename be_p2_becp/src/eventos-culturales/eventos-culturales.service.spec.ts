import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventosCulturalesService } from './eventos-culturales.service';
import { EventosCulturale } from './entities/eventos-culturale.entity';

describe('EventosCulturalesService', () => {
  let service: EventosCulturalesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosCulturalesService,
        {
          provide: getRepositoryToken(EventosCulturale),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventosCulturalesService>(
      EventosCulturalesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});