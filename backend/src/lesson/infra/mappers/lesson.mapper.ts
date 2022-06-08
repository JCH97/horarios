import { LessonPersistence } from '../../../lesson/infra/entities/lesson.persistence';
import { Lesson } from '../../../lesson/domain/entities/lesson.entity';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { MajorMappers } from '../../../major/infra/mappers/major.mappers';
import { LocalMappers } from '../../../local/infra/mappers/local.mappers';
import { TeacherMappers } from '../../../teacher/infra/mappers/teacher.mappers';
import { LessonDto } from '../../application/dtos/lesson.dto';
import { LessonDetailsDto } from '../../application/dtos/lesson.details.dto';

export class LessonMappers {
  public static PersistToDomain(persist: LessonPersistence): Lesson {
    const domain = Lesson.Create({
          ...persist,
          major:
            persist.major ? MajorMappers.PersistToDomain(persist.major) : null,
          majorId: { id: persist.majorId },
          local:
            persist.local ? LocalMappers.PersistToDomain(persist.local) : null,
          localId: { id: persist.localId },
          teacher:
            persist.teacher ? TeacherMappers.PersistToDomain(persist.teacher) : null,
          teacherId: { id: persist.teacherId },
        },
        persist.id)
    ;

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: Lesson): Partial<LessonPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      duration: domain.duration,
      major: domain.majorId,
      local: domain.localId,
      teacher: domain.teacherId,
    };
  }

  public static DomainToDto(domain: Lesson): LessonDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      teacherId: domain.teacherId.id,
      localId: domain.localId.id,
      majorId: domain.majorId.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      duration: domain.duration,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Lesson>): PaginatedFindResult<LessonDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(LessonMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: Lesson): LessonDetailsDto {
    let base = LessonMappers.DomainToDto(domain);

    return {
      ...base,
      teacher: domain.teacher ? TeacherMappers.DomainToDetails(domain.teacher) : null,
      major: domain.major ? MajorMappers.DomainToDto(domain.major) : null,
      local: domain.local ? LocalMappers.DomainToDto(domain.local) : null,
    };
  }
}
