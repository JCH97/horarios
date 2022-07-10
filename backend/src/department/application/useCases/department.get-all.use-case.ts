import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Department } from '../../domain/entities/department.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { DepartmentRepository } from '../../infra/repositories/department.repository';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { DepartmentFindAllDto } from '../dtos/department.get-all.dto';

export type FindAllDepartmentUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Department>>
    | AppError.ValidationErrorResult<FindAllResult<Department>>
    | AppError.ObjectNotExistResult<FindAllResult<Department>>,
    Result<FindAllResult<Department>>>;

@Injectable()
export class FindAllDepartmentUseCase implements IUseCase<DepartmentFindAllDto, Promise<FindAllDepartmentUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly departmentRepository: DepartmentRepository) {
    this._logger = new Logger('FindAllDepartmentUseCase');
  }

  async execute(request: DepartmentFindAllDto): Promise<FindAllDepartmentUseCaseResponse> {
    try {
      const ans = await this.departmentRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
