import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { ExclusionRestrictionsPersistence } from '../entities/exclusion-restriction.persistence';
import { ExclusionRestrictions } from '../../domain/entities/exclusion-restriction.entity';
import { ExclusionRestrictionsDto } from '../../application/dtos/exclusion-restriction/exclusion-restrictions.dto';

export class ExclusionRestrictionsMappers {
  public static PersistToDomain(persist: ExclusionRestrictionsPersistence): ExclusionRestrictions {
    const domain = ExclusionRestrictions.Create({
      ...persist,
      conditions: JSON.parse(persist.conditions),
      teacherId: { id: persist.teacherId },
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: ExclusionRestrictions): Partial<ExclusionRestrictionsPersistence> {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      restrictionType: domain.restrictionType,
      teacherId: domain.teacherId.id,
      conditions: JSON.stringify(domain.condition),
      interval: domain.interval,
      attributes: domain.attributes,
      description: domain.description
    };
  }

  public static DomainToDto(domain: ExclusionRestrictions): ExclusionRestrictionsDto {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      conditions: domain.condition,
      interval: domain.interval,
      teacherId: domain.teacherId,
      attributes: domain.attributes,
      restrictionType: domain.restrictionType,
      description: domain.description
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<ExclusionRestrictions>): PaginatedFindResult<ExclusionRestrictionsDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(ExclusionRestrictionsMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: ExclusionRestrictions): ExclusionRestrictionsDto {
    let base = ExclusionRestrictionsMappers.DomainToDto(domain);

    return {
      ...base,
    };
  }

  public static AllToDto(all: FindAllResult<ExclusionRestrictions>): FindAllResult<ExclusionRestrictionsDto> {
    return {
      items: all.items.map(ExclusionRestrictionsMappers.DomainToDto),
    };
  }
}
