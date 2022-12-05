import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';

type DepartmentProps = DomainBaseProps & DomainTimestamp & {
  facultyId?: { id: string };
  faculty?: Faculty;
  teacherIds?: { id: string }[];
  teachers?: Teacher[];
};

type newDepartmentProps = Omit<DepartmentProps, 'id' | 'createdAt' | 'updatedAt'>;

export class Department extends DomainEntity<DepartmentProps> {

  get facultyId(): { id: string } {
    return this.props.facultyId;
  }

  get faculty(): Faculty {
    return this.props.faculty;
  }

  get shortName(): string {
    return this.props.shortName;
  }

  get teacherIds(): { id: string }[] {
    return this.props.teacherIds;
  }

  get teachers(): Teacher[] {
    return this.props.teachers;
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


  public static New(props: newDepartmentProps): Result<Department> {
    const ans: Result<Department> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: DepartmentProps, id: string = null): Result<Department> {
    // set guards here
    return Result.Ok(new Department(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.teacherIds = props.teachers ?? this.props.teacherIds;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.facultyId = props.facultyId ?? this.props.facultyId;

    this.props.updatedAt = new Date();
  }

}
