import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { Local } from '../../../local/domain/entities/local.entity';
import { Lesson } from '../../../lesson/domain/entities/lesson.entity';
import { TypeClass } from '../../../typeclass/domain/entities/typeclass.entity';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { v4 } from 'uuid';
import { Group } from '../../../group/domain/entities/group.entity';
import { Week } from '../../../week/domain/entities/week.entity';

type ClassProps = DomainBaseProps & DomainTimestamp & {
  teacherIds?: { id: string }[];
  teachers?: Teacher[];
  localId?: { id: string };
  local?: Local;
  lessonId?: { id: string };
  lesson?: Lesson;
  typeClassId?: { id: string };
  typeClass?: TypeClass;
  groupId?: { id: string };
  group?: Group;
  weekId?: { id: string };
  week?: Week;
  start: Date;
  end: Date;
  serieId: string;
  color: string;
  resourceId: string;
};


type newClassProps = Omit<ClassProps, 'id' | 'createdAt' | 'updatedAt'>;

export class Class extends DomainEntity<ClassProps> {

  get shortName(): string {
    return this.props.shortName;
  }

  get teacherIds(): { id: string }[] {
    return this.props.teacherIds;
  }

  get groupId(): { id: string } {
    return this.props.groupId;
  }

  get resourceId(): string {
    return this.props.resourceId;
  }

  get group(): Group {
    return this.props.group;
  }

  get color(): string {
    return this.props.color;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  get serieId() {
    return this.props.serieId;
  }

  get teachers(): Teacher[] {
    return this.props.teachers;
  }

  get weekId(): { id: string } {
    return this.props.weekId;
  }

  get week(): Week {
    return this.props.week;
  }

  get localId(): { id: string } {
    return this.props.localId;
  }

  get local(): Local {
    return this.props.local;
  }

  get lessonId(): { id: string } {
    return this.props.lessonId;
  }

  get lesson(): Lesson {
    return this.props.lesson;
  }

  get typeClassId(): { id: string } {
    return this.props.typeClassId;
  }

  get typeClass(): TypeClass {
    return this.props.typeClass;
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

  set start(value) {
    this.props.start = value;
  }

  set end(value) {
    this.props.end = value;
  }

  public static New(props: newClassProps): Result<Class> {
    const ans: Result<Class> = this.Create({
      ...props,
      serieId: props.serieId ?? v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: any, id: string = null): Result<Class> {
    if (props.teacherIds && props.teacherIds.length > 0) {
      const cleanTeachers = new Set(props.teacherIds.map(t => t.id));
      props.teacherIds = Array.from(cleanTeachers).map(t => ({ id: t }));
    }

    return Result.Ok(new Class(props, new UniqueEntityID(id)));
  }

  public Update(props: any, includeDates = true) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.teacherIds = props.teacherId ?? this.props.teacherIds;
    this.props.localId = props.localId ?? this.props.localId;
    this.props.lessonId = props.lessonId ?? this.props.lessonId;
    this.props.typeClassId = props.typeClassId ?? this.props.typeClassId;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.groupId = props.groupId ?? this.props.groupId;
    this.props.weekId = props.weekId ?? this.props.weekId;
    this.props.resourceId = this.props.localId.id;
    this.props.color = props.color ?? this.props.color;

    if (includeDates) {
      this.props.start = props.start ?? this.props.start;
      this.props.end = props.end ?? this.props.end;
    }

    this.props.updatedAt = new Date();
  }
}
