import { Either, left, right } from '../../../shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Teacher } from '../../domain/entities/teacher.entity';
import { Result } from '../../../shared/core/Result';
import { Injectable, Logger } from '@nestjs/common';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { TeacherRepository } from '../../infra/repositories/teacher.repository';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { TeacherFindAllDto } from '../dtos/teacher.find-all.dto';

export type FindAllTeacherUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<FindAllResult<Teacher>>
    | AppError.ValidationErrorResult<FindAllResult<Teacher>>
    | AppError.ObjectNotExistResult<FindAllResult<Teacher>>,
    Result<FindAllResult<Teacher>>>;

@Injectable()
export class FindAllTeacherUseCase implements IUseCase<TeacherFindAllDto, Promise<FindAllTeacherUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly teacherRepository: TeacherRepository) {
    this._logger = new Logger('FindAllTeacherUseCase');
  }

  async execute(request: TeacherFindAllDto): Promise<FindAllTeacherUseCaseResponse> {
    try {
      const ans = await this.teacherRepository.findAll(request.filter);
      return right(Result.Ok(ans));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
