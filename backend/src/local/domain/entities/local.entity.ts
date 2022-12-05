import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';

type LocalProps = DomainBaseProps & DomainTimestamp & {
  facultyId: string;
  faculty?: Faculty;
  capacity: number;
};

type newLocalProps = Omit<LocalProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Local extends DomainEntity<LocalProps> {

  get shortName(): string {
    return this.props.shortName;
  }

  get faculty(): Faculty {
    return this.props.faculty;
  }

  get facultyId(): string {
    return this.props.facultyId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get capacity(): number {
    return this.props.capacity;
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

  public static New(props: newLocalProps): Result<Local> {
    const ans: Result<Local> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: LocalProps, id: string = null): Result<Local> {
    return Result.Ok(new Local(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.facultyId = props.facultyIds ?? this.props.facultyId;
    this.props.capacity = props.capacity ?? this.props.capacity;

    this.props.updatedAt = new Date();
  }
}
