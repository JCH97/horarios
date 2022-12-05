import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Class } from '../../../class/domain/entities/class.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { ClassFindAllDto } from '../../../class/application/dtos/class.find-all.dto';
import { ClassRepository } from '../../../class/infra/repositories/class.repository';

export type FindAllClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Class>>
    | AppError.ValidationErrorResult<FindAllResult<Class>>
    | AppError.ObjectNotExistResult<FindAllResult<Class>>,
    Result<FindAllResult<Class>>>;

@Injectable()
export class FindAllClassUseCase implements IUseCase<ClassFindAllDto, Promise<FindAllClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly classRepository: ClassRepository) {
    this._logger = new Logger('FindAllClassUseCase');
  }

  async execute(request: ClassFindAllDto): Promise<FindAllClassUseCaseResponse> {
    try {
      const ans = await this.classRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
