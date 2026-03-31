import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';
import { FilmsRepository } from './films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
