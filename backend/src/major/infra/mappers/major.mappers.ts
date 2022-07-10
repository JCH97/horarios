import { MajorPersistence } from '../entities/major.persistence';
import { Major } from '../../domain/entities/major.entity';
import { MajorDto } from '../../application/dtos/major.dto';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { Faculty } from '../../../faculty/domain/entities/faculty.entity';
import { FacultyDto } from '../../../faculty/application/dtos/faculty.dto';
import { MajorDetailsDto } from '../../application/dtos/major.details.dto';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';

export class MajorMappers {
  public static PersistToDomain(persist: MajorPersistence): Major {
    const domain = Major.Create({
      ...persist,
      faculty: persist.faculty ? FacultyMappers.PersistToDomain(persist.faculty) : null,
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: Major): Partial<MajorPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      facultyId: domain.facultyId,
      duration: domain.duration,
    };
  }


  public static AllToDto(all: FindAllResult<Major>): FindAllResult<MajorDto> {
    return {
      items: all.items.map(MajorMappers.DomainToDto),
    };
  }

  public static DomainToDto(domain: Major): MajorDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      duration: domain.duration,
      facultyId: domain.facultyId,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Major>): PaginatedFindResult<MajorDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(MajorMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: Major): MajorDetailsDto {
    let base = MajorMappers.DomainToDto(domain);

    return {
      ...base,
      faculty: domain.faculty ? FacultyMappers.DomainToDetails(domain.faculty) : null,
    };
  }
}
