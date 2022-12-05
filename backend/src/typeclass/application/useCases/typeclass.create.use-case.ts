import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { TypeClass } from '../../domain/entities/typeclass.entity';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { TypeclassCreateDto } from '../dtos/typeclass.create.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TypeclassRepository } from '../../infra/repositories/typeclass.repository';

export type CreateLocalUseCaseResponse = Either<AppError.UnexpectedErrorResult<TypeClass>
  | AppError.ValidationErrorResult<TypeClass>,
  Result<TypeClass>>;

@Injectable()
export class CreateTypeClassUseCase implements IUseCase<TypeclassCreateDto, Promise<CreateLocalUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly typeClassRepository: TypeclassRepository) {
    this._logger = new Logger('CreateLocalUseCase');
  }

  async execute(request: TypeclassCreateDto): Promise<CreateLocalUseCaseResponse> {
    this._logger.log('Executing...');

    const localOrError: Result<TypeClass> = TypeClass.New({ ...request });

    if (localOrError.isFailure)
      return left(localOrError);

    const typeClass: TypeClass = localOrError.unwrap();

    try {
      await this.typeClassRepository.save(typeClass);
      return right(Result.Ok(typeClass));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }

  }
}
