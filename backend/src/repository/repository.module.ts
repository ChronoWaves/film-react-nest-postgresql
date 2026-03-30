import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema } from './film.schema';
import { FilmsRepository } from './films.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }])],
  providers: [FilmsRepository],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
