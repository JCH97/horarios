import { ClassPersistence } from '../entities/class.persistence';
import { Class } from '../../domain/entities/class.entity';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { ClassDto } from '../../application/dtos/class.dto';
import { ClassDetailsDto } from '../../application/dtos/class.details.dto';
import { TeacherMappers } from '../../../teacher/infra/mappers/teacher.mappers';
import { LocalMappers } from '../../../local/infra/mappers/local.mappers';
import { LessonMappers } from '../../../lesson/infra/mappers/lesson.mapper';
import { TypeclassMappers } from '../../../typeclass/infra/mappers/typeclass.mappers';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { GroupMappers } from '../../../group/infra/mappers/group.mapper';
import { WeekMapper } from '../../../week/infra/mappers/week.mapper';

export class ClassMappers {
  public static PersistToDomain(persist: ClassPersistence): Class {
    const domain = Class.Create({
      ...persist,
      teachers:
        persist.teachers ? persist.teachers.map(t => TeacherMappers.PersistToDomain(t)) : [],
      local: persist.local ? LocalMappers.PersistToDomain(persist.local) : null,
      localId: { id: persist.localId },
      lesson: persist.lesson ? LessonMappers.PersistToDomain(persist.lesson) : null,
      lessonId: { id: persist.lessonId },
      typeClass: persist.typeClass ? TypeclassMappers.PersistToDomain(persist.typeClass) : null,
      typeClassId: { id: persist.typeClassId },
      group: persist.group ? GroupMappers.PersistToDomain(persist.group) : null,
      groupId: { id: persist.groupId },
      weekId: { id: persist.weekId },
      week: persist.week ? WeekMapper.PersistToDomain(persist.week) : null,
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: Class): Partial<ClassPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      teachers: domain.teacherIds,
      local: domain.localId,
      lesson: domain.lessonId,
      typeClass: domain.typeClassId,
      week: domain.weekId,
      group: domain.groupId,
      start: domain.start,
      end: domain.end,
      serieId: domain.serieId,
      color: domain.color,
      resourceId: domain.resourceId,
    };
  }

  public static DomainToDto(domain: Class): ClassDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      end: domain.end,
      start: domain.start,
      serieId: domain.serieId,
      color: domain.color ?? '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
      resourceId: domain.resourceId,
      groupId: domain.groupId,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Class>): PaginatedFindResult<ClassDto> {

    return {
      items: pag.items.length > 0 ? pag.items.map(ClassMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }


  public static AllToDto(all: FindAllResult<Class>): FindAllResult<ClassDto> {
    return {
      items: all.items.map(ClassMappers.DomainToDto),
    };
  }

  public static DomainToDetails(domain: Class, amountInSerie = 1): ClassDetailsDto {
    let base = ClassMappers.DomainToDto(domain);

    return {
      ...base,
      teachers: domain.teachers ? domain.teachers.map(t => TeacherMappers.DomainToDetails(t)) : [],
      lesson: domain.lesson ? LessonMappers.DomainToDetails(domain.lesson) : null,
      typeClass: domain.typeClass ? TypeclassMappers.DomainToDetails(domain.typeClass) : null,
      local: domain.local ? LocalMappers.DomainToDetails(domain.local) : null,
      group: domain.group ? GroupMappers.DomainToDetails(domain.group) : null,
      week: domain.week ? WeekMapper.DomainToDetails(domain.week) : null,
      amountInSerie,
    };
  }
}
