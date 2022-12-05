import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { RemoveClassUseCase } from './class.remove.use-case';
import { FindAllClassUseCase } from './class.find-all.use-case';

export type RemoveInSerieClassUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<number | any>
    | AppError.ValidationErrorResult<number | any>
    | AppError.ObjectNotExistResult<number | any>,
    Result<number | any>>;

@Injectable()
export class RemoveInSerieClassUseCase implements IUseCase<{ id: string }, Promise<RemoveInSerieClassUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly remove: RemoveClassUseCase, private readonly findAll: FindAllClassUseCase) {
    this._logger = new Logger('RemoveInSerieClassUseCase');
  }

  async execute(request: { id: string }): Promise<RemoveInSerieClassUseCaseResponse> {

    let elems = (await this.findAll.execute({
      filter: { serieId: request.id },
    })).value.unwrap().items;


    for (let i = 0; i < elems.length; ++i) {
      const temp = await this.remove.execute({ id: elems[i]._id.toString() });

      if (temp.isLeft())
        return left(Result.Fail(new AppError.ValidationError(temp.value.unwrapError().message)));
    }

    return right(Result.Ok(elems.length));
  }
}
