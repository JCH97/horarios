import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Local } from '../../../local/domain/entities/local.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { LocalFindAllDto } from '../../../local/application/dtos/local.find-all.dto';
import { LocalRepository } from '../../../local/infra/repositories/local.repository';

export type FindAllLocalUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Local>>
    | AppError.ValidationErrorResult<FindAllResult<Local>>
    | AppError.ObjectNotExistResult<FindAllResult<Local>>,
    Result<FindAllResult<Local>>>;

@Injectable()
export class FindAllLocalUseCase implements IUseCase<LocalFindAllDto, Promise<FindAllLocalUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly localRepository: LocalRepository) {
    this._logger = new Logger('FindAllLocalUseCase');
  }

  async execute(request: LocalFindAllDto): Promise<FindAllLocalUseCaseResponse> {
    try {
      const ans = await this.localRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
