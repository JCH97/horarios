import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { DistributionRestrictionsPersistence } from '../entities/distribution-restriction.persistence';
import { DistributionRestrictions } from '../../domain/entities/distribution-restriction.entity';
import {
  DistributionRestrictionsDto,
} from '../../application/dtos/distribution-restrictions/distribution-restrictions.dto';

export class DistributionRestrictionsMappers {
  public static PersistToDomain(persist: DistributionRestrictionsPersistence): DistributionRestrictions {
    const domain = DistributionRestrictions.Create({
      ...persist,
      conditions: JSON.parse(persist.conditions),
      teacherId: { id: persist.teacherId },
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: DistributionRestrictions): Partial<DistributionRestrictionsPersistence> {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      restrictionType: domain.restrictionType,
      teacherId: domain.teacherId.id,
      conditions: JSON.stringify(domain.condition),
      min: domain.min,
      interval: domain.interval,
      operator: domain.operator,
      attribute: domain.attribute,
      description: domain.description
    };
  }

  public static DomainToDto(domain: DistributionRestrictions): DistributionRestrictionsDto {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      conditions: domain.condition,
      min: domain.min,
      interval: domain.interval,
      teacherId: domain.teacherId,
      attribute: domain.attribute,
      operator: domain.operator,
      restrictionType: domain.restrictionType,
      description: domain.description
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<DistributionRestrictions>): PaginatedFindResult<DistributionRestrictionsDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(DistributionRestrictionsMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: DistributionRestrictions): DistributionRestrictionsDto {
    let base = DistributionRestrictionsMappers.DomainToDto(domain);

    return {
      ...base,
    };
  }

  public static AllToDto(all: FindAllResult<DistributionRestrictions>): FindAllResult<DistributionRestrictionsDto> {
    return {
      items: all.items.map(DistributionRestrictionsMappers.DomainToDto),
    };
  }
}
