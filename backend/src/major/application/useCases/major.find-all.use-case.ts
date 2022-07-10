import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Major } from '../../../major/domain/entities/major.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { MajorFindAllDto } from '../../../major/application/dtos/major.find-all.dto';
import { MajorRepository } from '../../../major/infra/repositories/major.repository';

export type FindAllMajorUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Major>>
    | AppError.ValidationErrorResult<FindAllResult<Major>>
    | AppError.ObjectNotExistResult<FindAllResult<Major>>,
    Result<FindAllResult<Major>>>;

@Injectable()
export class FindAllMajorUseCase implements IUseCase<MajorFindAllDto, Promise<FindAllMajorUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly majorRepository: MajorRepository) {
    this._logger = new Logger('FindAllMajorUseCase');
  }

  async execute(request: MajorFindAllDto): Promise<FindAllMajorUseCaseResponse> {
    try {
      const ans = await this.majorRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
