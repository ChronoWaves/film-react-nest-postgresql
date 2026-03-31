import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';
import { IFilm, ISchedule } from './film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async findAll(): Promise<IFilm[]> {
    const films = await this.filmRepo.find();
    return films.map((film) => this.toFilmInterface(film));
  }

  async findById(id: string): Promise<IFilm | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });
    if (!film) {
      return null;
    }
    return this.toFilmInterface(film);
  }

  async getSchedule(filmId: string): Promise<ISchedule[]> {
    const schedules = await this.scheduleRepo.find({
      where: { filmId },
    });
    return schedules.map((s) => this.toScheduleInterface(s));
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ISchedule | null> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: sessionId, filmId },
    });

    if (!schedule) {
      return null;
    }

    const currentTaken = this.parseTaken(schedule.taken);

    const alreadyTaken = seats.filter((seat) => currentTaken.includes(seat));
    if (alreadyTaken.length > 0) {
      throw new Error(`Места уже забронированы: ${alreadyTaken.join(', ')}`);
    }

    const updatedTaken = [...currentTaken, ...seats];
    schedule.taken = updatedTaken.join(',');

    await this.scheduleRepo.save(schedule);

    return this.toScheduleInterface(schedule);
  }

  private parseTaken(taken: string): string[] {
    if (!taken || taken.trim() === '') {
      return [];
    }
    return taken.split(',').filter((s) => s.trim() !== '');
  }

  private parseTags(tags: string): string[] {
    if (!tags || tags.trim() === '') {
      return [];
    }
    return tags.split(',').map((t) => t.trim());
  }

  private toFilmInterface(film: Film): IFilm {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule
        ? film.schedule.map((s) => this.toScheduleInterface(s))
        : [],
    };
  }

  private toScheduleInterface(schedule: Schedule): ISchedule {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: this.parseTaken(schedule.taken),
    };
  }
}
