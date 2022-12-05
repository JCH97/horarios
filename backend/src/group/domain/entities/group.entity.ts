import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Major } from '../../../major/domain/entities/major.entity';
import { Guard } from '../../../shared/core/Guard';
import { AppError } from '../../../shared/core/errors/AppError';

type GroupProps = DomainBaseProps & DomainTimestamp & {
  majorId?: { id: string };
  major?: Major | any;
  year: number;
  color: string;
};

type newGroupProps = Omit<GroupProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Group extends DomainEntity<GroupProps> {

  get shortName(): string {
    return this.props.shortName;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get description(): string {
    return this.props.description;
  }

  get color(): string {
    return this.props.color;
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

  get majorId(): { id: string } {
    return this.props.majorId;
  }

  get major(): Major {
    return this.props.major;
  }

  get year(): number {
    return this.props.year;
  }

  public static New(props: newGroupProps): Result<Group> {
    const ans: Result<Group> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: GroupProps, id: string = null): Result<Group> {

    const validYear = Guard.inRange({
      argumentPath: 'year',
      max: 5,
      min: 1,
      num: props.year,
    });

    if (!validYear.succeeded)
      return Result.Fail(new AppError.ValidationError(validYear.message));

    return Result.Ok(new Group(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.majorId = props.majorId ?? this.props.majorId;
    this.props.year = props.year ?? this.props.year;

    this.props.updatedAt = new Date();
  }
}
