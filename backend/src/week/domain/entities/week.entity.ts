import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Semester } from '../../../semester/domain/entities/semester.entity';

type WeekProps = DomainBaseProps & DomainTimestamp & {
  duration: number;
  firstDate?: Date;
  endDate?: Date;
  semesterId?: { id: string };
  semester?: Semester;
  number: number;
};

type newWeekProps = Omit<WeekProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Week extends DomainEntity<WeekProps> {

  get duration(): number {
    return this.props.duration;
  }

  get number(): number {
    return this.props.number;
  }

  get semesterId(): { id: string } {
    return this.props.semesterId;
  }

  get semester(): Semester {
    return this.props.semester;
  }

  get firstDate(): Date {
    return this.props.firstDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get shortName(): string {
    return this.props.shortName;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): number {
    return this.props.priority ?? 1;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newWeekProps): Result<Week> {
    const ans: Result<Week> = this.Create({
      ...props,
      endDate: new Date(props.endDate.setHours(23, 59, 59, 999)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: WeekProps, id: string = null): Result<Week> {
    // set guards here
    return Result.Ok(new Week(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.duration = props.duration ?? this.props.duration;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.firstDate = props.firstDate ?? this.props.firstDate;
    this.props.endDate = props.endDate ?? this.props.endDate;
    this.props.number = props.number ?? this.props.number;

    this.props.updatedAt = new Date();
  }
}
