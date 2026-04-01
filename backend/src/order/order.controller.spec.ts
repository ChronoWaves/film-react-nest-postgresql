import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    const validOrderDto: OrderDto = {
      email: 'user@example.com',
      phone: '+70000000000',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-04-01T10:00:00',
          row: 3,
          seat: 5,
          price: 350,
        },
      ],
    };

    it('should create an order and return result', async () => {
      const expectedResult: OrderResponseDto = {
        total: 1,
        items: [
          {
            id: 'generated-uuid',
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 5,
            price: 350,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(validOrderDto);

      expect(result).toEqual(expectedResult);
      expect(orderService.createOrder).toHaveBeenCalledWith(validOrderDto);
      expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle order with multiple tickets', async () => {
      const multiTicketOrder: OrderDto = {
        email: 'user@example.com',
        phone: '+70000000000',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 5,
            price: 350,
          },
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 6,
            price: 350,
          },
        ],
      };

      const expectedResult: OrderResponseDto = {
        total: 2,
        items: [
          {
            id: 'uuid-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 5,
            price: 350,
          },
          {
            id: 'uuid-2',
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 6,
            price: 350,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.createOrder(multiTicketOrder);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('should propagate BadRequestException from service', async () => {
      mockOrderService.createOrder.mockRejectedValue(
        new BadRequestException('Список билетов пуст'),
      );

      await expect(controller.createOrder(validOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should propagate BadRequestException when seats are taken', async () => {
      mockOrderService.createOrder.mockRejectedValue(
        new BadRequestException('Места уже забронированы: 3:5'),
      );

      await expect(controller.createOrder(validOrderDto)).rejects.toThrow(
        'Места уже забронированы: 3:5',
      );
    });

    it('should pass the exact dto to the service', async () => {
      mockOrderService.createOrder.mockResolvedValue({ total: 0, items: [] });

      await controller.createOrder(validOrderDto);

      expect(orderService.createOrder).toHaveBeenCalledWith({
        email: 'user@example.com',
        phone: '+70000000000',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-04-01T10:00:00',
            row: 3,
            seat: 5,
            price: 350,
          },
        ],
      });
    });
  });
});