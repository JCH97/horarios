import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { University } from '../../../university/domain/entities/university.entity';

type FacultyProps = DomainBaseProps & DomainTimestamp & {
  universityId: string;
  university?: University;
};

type newFacultyProps = Omit<FacultyProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Faculty extends DomainEntity<FacultyProps> {

  get universityId(): string {
    return this.props.universityId;
  }

  get university(): University {
    return this.props.university;
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

  public static New(props: newFacultyProps): Result<Faculty> {
    const ans: Result<Faculty> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: FacultyProps, id: string = null): Result<Faculty> {
    return Result.Ok(new Faculty(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.universityId = props.universityId ?? this.props.universityId;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;

    this.props.updatedAt = new Date();
  }
}
