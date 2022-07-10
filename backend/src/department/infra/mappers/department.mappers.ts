import { DepartmentPersistence } from '../entities/department.persistence';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { DepartmentDto } from '../../application/dtos/department.dto';
import { DepartmentDetailsDto } from '../../application/dtos/department.details.dto';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';
import { Department } from '../../domain/entities/department.entity';
import { TeacherMappers } from '../../../teacher/infra/mappers/teacher.mappers';

export class DepartmentMappers {
  public static PersistToDomain(persist: DepartmentPersistence): Department {
    const domain = Department.Create({
      ...persist,
      teachers:
        persist.teachers ? persist.teachers.map(t => TeacherMappers.PersistToDomain(t)) : [],
      faculty: persist.faculty ? FacultyMappers.PersistToDomain(persist.faculty) : null,
      facultyId: persist.facultyId ? { id: persist.facultyId } : null,
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: Department): Partial<DepartmentPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      teachers: domain.teacherIds,
      faculty: domain.facultyId,
    };
  }

  public static DomainToDto(domain: Department): DepartmentDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      facultyId: domain.facultyId,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Department>): PaginatedFindResult<DepartmentDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(DepartmentMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: Department): DepartmentDetailsDto {
    let base = DepartmentMappers.DomainToDto(domain);

    return {
      ...base,
      teachers: domain.teachers ? domain.teachers.map(t => TeacherMappers.DomainToDetails(t)) : [],
      faculty: domain.faculty ? FacultyMappers.DomainToDetails(domain.faculty) : null,
    };
  }
}
