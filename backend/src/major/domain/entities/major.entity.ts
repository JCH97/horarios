import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';

type MajorProps = DomainBaseProps & DomainTimestamp & {
  facultyId: string
  duration: number
  faculty?: Faculty;
}

type newMajorProps = Omit<MajorProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Major extends DomainEntity<MajorProps> {

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

  get duration(): number {
    return this.props.duration;
  }

  get facultyId(): string {
    return this.props.facultyId;
  }

  get faculty(): Faculty {
    return this.props.faculty;
  }

  public static New(props: newMajorProps): Result<Major> {
    const ans: Result<Major> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: MajorProps, id: string = null): Result<Major> {
    return Result.Ok(new Major(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.duration = props.duration ?? this.props.duration;
    this.props.facultyId = props.faculty ?? this.props.facultyId;
    this.props.updatedAt = new Date();
  }
}
