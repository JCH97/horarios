import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { FindAllResult } from '../../../shared/core/FindAllResult';
import { RelationalRestrictionsPersistence } from '../entities/relational-restriction.persistence';
import { RelationalRestrictions } from '../../domain/entities/RelationalRequirement';
import { RelationalRestrictionsDto } from '../../application/dtos/relational-restrictions/relational-restrictions.dto';

export class RelationalRestrictionsMappers {
  public static PersistToDomain(persist: RelationalRestrictionsPersistence): RelationalRestrictions {
    const domain = RelationalRestrictions.Create({
      ...persist,
      conditions: JSON.parse(persist.conditions),
      subConditions: JSON.parse(persist.subConditions),
      teacherId: { id: persist.teacherId },
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: RelationalRestrictions): Partial<RelationalRestrictionsPersistence> {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      restrictionType: domain.restrictionType,
      teacherId: domain.teacherId.id,
      conditions: JSON.stringify(domain.condition),
      subConditions: JSON.stringify(domain.subConditions),
      interval: domain.interval,
      operator: domain.operator,
      attribute: domain.attribute,
      description: domain.description
    };
  }

  public static DomainToDto(domain: RelationalRestrictions): RelationalRestrictionsDto {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      conditions: domain.condition,
      interval: domain.interval,
      subConditions: domain.subConditions,
      teacherId: domain.teacherId,
      operator: domain.operator,
      restrictionType: domain.restrictionType,
      attribute: domain.attribute,
      description: domain.description
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<RelationalRestrictions>): PaginatedFindResult<RelationalRestrictionsDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(RelationalRestrictionsMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: RelationalRestrictions): RelationalRestrictionsDto {
    let base = RelationalRestrictionsMappers.DomainToDto(domain);

    return {
      ...base,
    };
  }

  public static AllToDto(all: FindAllResult<RelationalRestrictions>): FindAllResult<RelationalRestrictionsDto> {
    return {
      items: all.items.map(RelationalRestrictionsMappers.DomainToDto),
    };
  }

}
