import { UniversityPersistence } from '../entities/university.persistence';
import { University } from '../../domain/entities/university.entity';
import { UniversityDto } from '../../application/dtos/university.dto';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';

export class UniversityMapper {
  public static PersistToDomain(persist: UniversityPersistence): University {
    const domain = University.Create({
      ...persist,
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: University): Partial<UniversityPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  public static DomainToDto(domain: University): UniversityDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,

    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<University>): PaginatedFindResult<UniversityDto> {
    return {
      items: pag.items.map(this.DomainToDto),
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }
}