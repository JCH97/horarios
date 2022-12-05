import { LocalPersistence } from '../entities/local.persistence';
import { Local } from '../../domain/entities/local.entity';
import { LocalDto } from '../../application/dtos/local.dto';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { LocalDetailsDto } from '../../application/dtos/local.details.dto';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';
import { FindAllResult } from '../../../shared/core/FindAllResult';

export class LocalMappers {
  public static PersistToDomain(persist: LocalPersistence): Local {
    const domain = Local.Create({
      ...persist,
      faculty: persist.faculty ? FacultyMappers.PersistToDomain(persist.faculty) : null,
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: Local): Partial<LocalPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      facultyId: domain.facultyId,
      capacity: domain.capacity,
    };
  }


  public static AllToDto(all: FindAllResult<Local>): FindAllResult<LocalDto> {
    return {
      items: all.items.map(LocalMappers.DomainToDto),
    };
  }

  public static DomainToDto(domain: Local): LocalDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      capacity: domain.capacity,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Local>): PaginatedFindResult<LocalDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(LocalMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: Local): LocalDetailsDto {
    let base = LocalMappers.DomainToDto(domain);

    return {
      ...base,
      faculty: domain.faculty ? FacultyMappers.DomainToDetails(domain.faculty) : null,
    };
  }
}
