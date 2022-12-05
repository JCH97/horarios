import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Class } from '../../../class/domain/entities/class.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { ClassUpdateDto } from '../../../class/application/dtos/class.update.dto';
import { ClassRepository } from '../../../class/infra/repositories/class.repository';
import { FindAllClassUseCase } from './class.find-all.use-case';

export type UpdateMultipleClassByFieldUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<number | any>
    | AppError.ValidationErrorResult<number | any>
    | AppError.ObjectNotExistResult<number | any>,
    Result<number | any>>;

@Injectable()
export class UpdateMultipleClassByFieldsUseCase implements IUseCase<ClassUpdateDto, Promise<UpdateMultipleClassByFieldUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly classRepository: ClassRepository,
    private readonly findAll: FindAllClassUseCase) {
    this._logger = new Logger('UpdateMultipleClassByFieldUseCase');
  }

  async execute(request: ClassUpdateDto): Promise<UpdateMultipleClassByFieldUseCaseResponse> {
    this._logger.log('Executing');

    const classesWrapper = await this.findAll.execute({
      filter: {
        serieId: request.serieId,
      },
    });

    const classes = classesWrapper.value.unwrap().items;
    let updated = [];

    for (let i = 0; i < classes.length; ++i) {
      let forUpdate: Class = classes[i];
      forUpdate.Update(request, false);

      updated.push(forUpdate);
    }

    try {

      await this.classRepository.saveMany(updated);
      return right(Result.Ok(updated.length));

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
