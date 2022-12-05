import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { TypeClass } from '../../domain/entities/typeclass.entity';
import { TypeClassFindAllDto } from '../dtos/typeclass.find-all.dto';
import { TypeclassRepository } from '../../infra/repositories/typeclass.repository';

export type FindAllTypeClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<TypeClass>>
    | AppError.ValidationErrorResult<FindAllResult<TypeClass>>
    | AppError.ObjectNotExistResult<FindAllResult<TypeClass>>,
    Result<FindAllResult<TypeClass>>>;


@Injectable()
export class FindAllTypeClassUseCase implements IUseCase<TypeClassFindAllDto, Promise<FindAllTypeClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly typeClassRepository: TypeclassRepository) {
    this._logger = new Logger('FindAllTypeClassUseCase');
  }

  async execute(request: TypeClassFindAllDto): Promise<FindAllTypeClassUseCaseResponse> {
    try {
      const ans = await this.typeClassRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
