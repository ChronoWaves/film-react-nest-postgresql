import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import {
  FilmDto,
  FilmListResponseDto,
  ScheduleDto,
  ScheduleListResponseDto,
} from './dto/films.dto';
import { IFilm, ISchedule } from '../repository/film.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmListResponseDto> {
    const films = await this.filmsRepository.findAll();
    const items: FilmDto[] = films.map((film) => this.toFilmDto(film));
    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(filmId: string): Promise<ScheduleListResponseDto> {
    const schedule = await this.filmsRepository.getSchedule(filmId);
    const items: ScheduleDto[] = schedule.map((s) => this.toScheduleDto(s));
    return {
      total: items.length,
      items,
    };
  }

  private toFilmDto(film: IFilm): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toScheduleDto(schedule: ISchedule): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
