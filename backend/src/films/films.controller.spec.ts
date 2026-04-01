import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of films', async () => {
      const expectedResult: FilmListResponseDto = {
        total: 2,
        items: [
          {
            id: 'film-1',
            rating: 8.5,
            director: 'Director One',
            tags: ['drama', 'thriller'],
            title: 'Film One',
            about: 'About film one',
            description: 'Description of film one',
            image: '/content/image1.jpg',
            cover: '/content/cover1.jpg',
          },
          {
            id: 'film-2',
            rating: 7.2,
            director: 'Director Two',
            tags: ['comedy'],
            title: 'Film Two',
            about: 'About film two',
            description: 'Description of film two',
            image: '/content/image2.jpg',
            cover: '/content/cover2.jpg',
          },
        ],
      };

      mockFilmsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(filmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty list when no films', async () => {
      const expectedResult: FilmListResponseDto = {
        total: 0,
        items: [],
      };

      mockFilmsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('getSchedule', () => {
    it('should return schedule for a given film id', async () => {
      const filmId = 'film-1';
      const expectedResult: ScheduleListResponseDto = {
        total: 2,
        items: [
          {
            id: 'schedule-1',
            daytime: '2026-04-01T10:00:00',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 350,
            taken: ['1:5', '2:3'],
          },
          {
            id: 'schedule-2',
            daytime: '2026-04-01T14:00:00',
            hall: 2,
            rows: 8,
            seats: 15,
            price: 500,
            taken: [],
          },
        ],
      };

      mockFilmsService.getSchedule.mockResolvedValue(expectedResult);

      const result = await controller.getSchedule(filmId);

      expect(result).toEqual(expectedResult);
      expect(filmsService.getSchedule).toHaveBeenCalledWith(filmId);
      expect(filmsService.getSchedule).toHaveBeenCalledTimes(1);
    });

    it('should return empty schedule when no sessions', async () => {
      const filmId = 'film-no-schedule';
      const expectedResult: ScheduleListResponseDto = {
        total: 0,
        items: [],
      };

      mockFilmsService.getSchedule.mockResolvedValue(expectedResult);

      const result = await controller.getSchedule(filmId);

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });

    it('should pass the correct film id to the service', async () => {
      const filmId = 'specific-film-id';
      mockFilmsService.getSchedule.mockResolvedValue({ total: 0, items: [] });

      await controller.getSchedule(filmId);

      expect(filmsService.getSchedule).toHaveBeenCalledWith('specific-film-id');
    });
  });
});