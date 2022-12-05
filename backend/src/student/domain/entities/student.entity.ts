import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Major } from '../../../major/domain/entities/major.entity';

type StudentProps = DomainBaseProps & DomainTimestamp & {
  email: string;
  facultyId?: string;
  faculty?: Faculty;
  year: number;
  majorId?: string;
  major?: Major
};

type newStudentProps = Omit<StudentProps, 'id' | 'createdAt' | 'updatedAt'>;

export class Student extends DomainEntity<StudentProps> {

  get email(): string {
    return this.props.email;
  }

  get shortName(): string {
    return this.props.shortName;
  }

  get facultyId(): string {
    return this.props.facultyId;
  }

  get faculty(): Faculty {
    return this.props.faculty;
  }

  get majorId(): string {
    return this.props.majorId;
  }

  get major(): Major {
    return this.props.major;
  }

  get year(): number {
    return this.props.year;
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

  public SetFaculty(facId: string): void {

    if (!facId) return;
    this.props.facultyId = facId;
  }

  public SetMajor(majorId: string): void {
    if (!majorId) return;
    this.props.majorId = majorId;
  }

  public static New(props: newStudentProps): Result<Student> {
    const ans: Result<Student> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: StudentProps, id: string = null): Result<Student> {
    // set guards here
    return Result.Ok(new Student(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.email = props.email ?? this.props.email;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;

    this.SetFaculty(props.facultyId);
    this.SetMajor(props.majorId);

    this.props.updatedAt = new Date();
  }

}
