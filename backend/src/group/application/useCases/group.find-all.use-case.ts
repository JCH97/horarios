import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Group } from '../../../group/domain/entities/group.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { GroupFindAllDto } from '../../../group/application/dtos/group.find-all.dto';
import { GroupRepository } from '../../../group/infra/repositories/group.repository';

export type FindAllGroupUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Group>>
    | AppError.ValidationErrorResult<FindAllResult<Group>>
    | AppError.ObjectNotExistResult<FindAllResult<Group>>,
    Result<FindAllResult<Group>>>;

@Injectable()
export class FindAllGroupUseCase implements IUseCase<GroupFindAllDto, Promise<FindAllGroupUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly groupRepository: GroupRepository) {
    this._logger = new Logger('FindAllGroupUseCase');
  }

  async execute(request: GroupFindAllDto): Promise<FindAllGroupUseCaseResponse> {
    try {
      const ans = await this.groupRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
