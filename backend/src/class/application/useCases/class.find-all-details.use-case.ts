import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Class } from '../../../class/domain/entities/class.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { ClassFindAllDto } from '../../../class/application/dtos/class.find-all.dto';
import { ClassRepository } from '../../../class/infra/repositories/class.repository';

export type FindAllWithDetailsClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Class>>
    | AppError.ValidationErrorResult<FindAllResult<Class>>
    | AppError.ObjectNotExistResult<FindAllResult<Class>>,
    Result<FindAllResult<Class>>>;

@Injectable()
export class FindAllWithDetailsClassUseCase implements IUseCase<ClassFindAllDto, Promise<FindAllWithDetailsClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly classRepository: ClassRepository) {
    this._logger = new Logger('FindAllWithDetailsClassUseCase');
  }

  async execute(request: ClassFindAllDto): Promise<FindAllWithDetailsClassUseCaseResponse> {
    try {
      const ans = await this.classRepository.findAllWithDetails(
        request.filter,
        {
          start: 'ASC',
        });

      return right(Result.Ok({
        items: ans,
      }));

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
