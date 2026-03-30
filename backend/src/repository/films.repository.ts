import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDocument, IFilm, ISchedule } from './film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel('Film') private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<IFilm[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<IFilm | null> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async getSchedule(filmId: string): Promise<ISchedule[]> {
    const film = await this.filmModel.findOne({ id: filmId }).lean().exec();
    if (!film) {
      return [];
    }
    return film.schedule;
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ISchedule | null> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      return null;
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      return null;
    }

    const alreadyTaken = seats.filter((seat) => session.taken.includes(seat));
    if (alreadyTaken.length > 0) {
      throw new Error(`Места уже забронированы: ${alreadyTaken.join(', ')}`);
    }

    session.taken.push(...seats);

    await film.save();
    return session;
  }
}
