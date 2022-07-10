import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { Major } from '../../../major/domain/entities/major.entity';
import { Local } from '../../../local/domain/entities/local.entity';
import { Semester } from '../../../semester/domain/entities/semester.entity';

type LessonProps = DomainBaseProps & DomainTimestamp & {
  duration: number;
  year: number;
  teacherId?: { id: string };
  teacher?: Teacher;
  majorId?: { id: string };
  major?: Major;
  localId?: { id: string };
  local?: Local;
  semesterIds?: { id: string }[];
  semesters?: Semester[];
};

type newLessonProps = Omit<LessonProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class Lesson extends DomainEntity<LessonProps> {

  get duration(): number {
    return this.props.duration;
  }

  get year(): number {
    return this.props.year;
  }

  get teacherId(): { id: string } {
    return this.props.teacherId;
  }

  get teacher(): Teacher {
    return this.props.teacher;
  }

  get majorId(): { id: string } {
    return this.props.majorId;
  }

  get major(): Major {
    return this.props.major;
  }

  get localId(): { id: string } {
    return this.props.localId;
  }

  get local(): Local {
    return this.props.local;
  }

  get semesterIds(): { id: string }[] {
    return this.props.semesterIds;
  }

  get semesters(): Semester[] {
    return this.props.semesters;
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
    return this.props.priority;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newLessonProps): Result<Lesson> {
    const ans: Result<Lesson> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: LessonProps, id: string = null): Result<Lesson> {
    // set guards here
    return Result.Ok(new Lesson(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;

    this.props.teacherId = props.teacherId ?? this.props.teacherId;
    this.props.majorId = props.majorId ?? this.props.majorId;
    this.props.localId = props.localId ?? this.props.localId;
    this.props.semesterIds =
      props.semesterIds && props.semesterIds.length > 0
        ? props.semesterIds
        : this.props.semesterIds;

    this.props.updatedAt = new Date();
  }
}
