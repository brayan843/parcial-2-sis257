import { Test, TestingModule } from '@nestjs/testing';
import { RecintosService } from './recintos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recinto } from './entities/recinto.entity';

describe('RecintosService', () => {
  let service: RecintosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecintosService,
        {
          provide: getRepositoryToken(Recinto),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecintosService>(RecintosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});