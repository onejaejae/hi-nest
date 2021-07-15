import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.create({ title: 'hi', year: 12, genres: ['action'] });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });

  describe('deleteOne()', () => {
    it('delete a movie', () => {
      try {
        service.create({ title: 'hi', year: 12, genres: ['action'] });
        service.deleteOne(1);
        service.getOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return a 404', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create()', () => {
    it('should create a movie', () => {
      const beforeMovie = service.getAll().length;
      service.create({ title: 'hi', year: 12, genres: ['action'] });
      const afterMovie = service.getAll().length;

      expect(afterMovie).toBeGreaterThan(beforeMovie);
    });
  });

  describe('update()', () => {
    it('should update a movie', () => {
      service.create({ title: 'hi', year: 12, genres: ['action'] });
      service.update(1, { title: 'hello' });

      const updateMovie = service.getOne(1);

      expect(updateMovie.title).toEqual('hello');
    });

    it('should throw 404 error', () => {
      try {
        service.update(999, { title: 'hello' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
