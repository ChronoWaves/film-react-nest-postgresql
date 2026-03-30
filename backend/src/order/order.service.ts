import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FilmsRepository } from '../repository/films.repository';
import { OrderDto, OrderResponseDto, TicketResultDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orderDto: OrderDto): Promise<OrderResponseDto> {
    const { tickets } = orderDto;

    if (!tickets || tickets.length === 0) {
      throw new BadRequestException('Список билетов пуст');
    }

    const ticketsBySession = new Map<string, typeof tickets>();

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      if (!ticketsBySession.has(key)) {
        ticketsBySession.set(key, []);
      }
      ticketsBySession.get(key).push(ticket);
    }

    const resultItems: TicketResultDto[] = [];

    for (const [, sessionTickets] of ticketsBySession) {
      const { film: filmId, session: sessionId } = sessionTickets[0];

      const seats = sessionTickets.map((t) => `${t.row}:${t.seat}`);

      try {
        const session = await this.filmsRepository.addTakenSeats(
          filmId,
          sessionId,
          seats,
        );

        if (!session) {
          throw new BadRequestException(
            `Сеанс ${sessionId} фильма ${filmId} не найден`,
          );
        }

        for (const ticket of sessionTickets) {
          resultItems.push({
            id: randomUUID(),
            film: ticket.film,
            session: ticket.session,
            daytime: ticket.daytime || session.daytime,
            row: ticket.row,
            seat: ticket.seat,
            price: ticket.price || session.price,
          });
        }
      } catch (error: unknown) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException(
          error instanceof Error ? error.message : 'Ошибка бронирования',
        );
      }
    }

    return {
      total: resultItems.length,
      items: resultItems,
    };
  }
}
