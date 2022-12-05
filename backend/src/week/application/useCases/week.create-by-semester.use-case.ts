import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from '../../../shared/core/errors/AppError';
import { Week } from '../../domain/entities/week.entity';
import { Result } from '../../../shared/core/Result';
import { IUseCase } from '../../../shared/core/interfaces/IUseCase';
import { Injectable, Logger } from '@nestjs/common';
import { WeekRepository } from '../../infra/repositories/week.repository';
import { WeekCreateBySemesterDto } from '../dtos/week.create-by-semester.dto';

export type CreateWeekBySemesterUseCaseResponse = Either<AppError.UnexpectedErrorResult<number>
  | AppError.ValidationErrorResult<number>,
  Result<number>>;

@Injectable()
export class CreateWeekBySemesterUseCase implements IUseCase<WeekCreateBySemesterDto, Promise<CreateWeekBySemesterUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly weekRepository: WeekRepository) {
    this._logger = new Logger('CreateWeekBySemesterUseCase');
  }

  async execute(request: WeekCreateBySemesterDto): Promise<CreateWeekBySemesterUseCaseResponse> {
    this._logger.log('Executing...');

    let weeks: Week[] = [];

    let initialDate = new Date(request.semesterStart);
    for (let i = 1; ; ++i) {
      const lastDate = this.getEndOfWeek(initialDate, new Date(request.semesterEnd));

      if (initialDate >= new Date(request.semesterEnd)) break;

      const weekDomainOrError: Result<Week> = Week.New({
        firstDate: initialDate,
        endDate: lastDate,
        description: `Generado automatico. Semana: ${i}`,
        duration: 5,
        fullName: `Semana: ${i}`,
        shortName: `S${i}`,
        priority: 1,
        semesterId: request.semesterId,
        number: i,
      });

      const week: Week = weekDomainOrError.unwrap();
      weeks.push(week);

      initialDate = this.getStartOfWeek(lastDate);
    }


    try {
      await this.weekRepository.saveMany(weeks);
      return right(Result.Ok(weeks.length));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }

  private getStartOfWeek(date: Date) {

    let copy = new Date(date.getTime());

    const nextMonday = new Date(
      copy.setDate(
        copy.getDate() + ((7 - copy.getDay() + 1) % 7 || 7),
      ),
    );

    nextMonday.setHours(0, 0, 0, 0);

    return nextMonday;
  }

  private getEndOfWeek(date: Date, semesterEnd: Date): Date {
    let copy = new Date(date.getTime());

    const nextFriday = new Date(
      copy.setDate(
        copy.getDate() + ((7 - copy.getDay() + 5) % 7 || 7),
      ),
    );

    nextFriday.setHours(0, 0, 0, 0);

    return nextFriday < semesterEnd
      ? nextFriday
      : semesterEnd;
  }
}
