import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { University } from '../../domain/entities/university.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { UniversityRepository } from '../../infra/repositories/university.repository';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { UniversityFindAllDto } from '../dtos/university.find-all.dto';

export type FindAllUniversityUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<University>>
    | AppError.ValidationErrorResult<FindAllResult<University>>
    | AppError.ObjectNotExistResult<FindAllResult<University>>,
    Result<FindAllResult<University>>>;

@Injectable()
export class FindAllUniversityUseCase implements IUseCase<UniversityFindAllDto, Promise<FindAllUniversityUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly universityRepository: UniversityRepository) {
    this._logger = new Logger('FindAllUniversityUseCase');
  }

  async execute(request: UniversityFindAllDto): Promise<FindAllUniversityUseCaseResponse> {
    try {
      const ans = await this.universityRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
