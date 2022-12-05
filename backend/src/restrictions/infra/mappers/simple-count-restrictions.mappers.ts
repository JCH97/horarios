import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { SimpleCountRestrictionsPersistence } from '../entities/simple-count-restrictions.persistence';
import { SimpleCountRestrictions } from '../../domain/entities/simple-count-restriction.entity';
import { SimpleCountRestrictionsDto } from '../../application/dtos/count-restrictions/simple-count-restrictions.dto';
import { FindAllResult } from '../../../shared/core/FindAllResult';

export class SimpleCountRestrictionsMappers {
  public static PersistToDomain(persist: SimpleCountRestrictionsPersistence): SimpleCountRestrictions {
    const domain = SimpleCountRestrictions.Create({
      ...persist,
      conditions: JSON.parse(persist.conditions),
      teacherId: { id: persist.teacherId },
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: SimpleCountRestrictions): Partial<SimpleCountRestrictionsPersistence> {
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
      part: domain.part,
      operator: domain.operator,
      description: domain.description
    };
  }

  public static DomainToDto(domain: SimpleCountRestrictions): SimpleCountRestrictionsDto {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      conditions: domain.condition,
      min: domain.min,
      interval: domain.interval,
      part: domain.part,
      teacherId: domain.teacherId,
      operator: domain.operator,
      restrictionType: domain.restrictionType,
      description: domain.description
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<SimpleCountRestrictions>): PaginatedFindResult<SimpleCountRestrictionsDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(SimpleCountRestrictionsMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: SimpleCountRestrictions): SimpleCountRestrictionsDto {
    let base = SimpleCountRestrictionsMappers.DomainToDto(domain);

    return {
      ...base,
    };
  }

  public static AllToDto(all: FindAllResult<SimpleCountRestrictions>): FindAllResult<SimpleCountRestrictionsDto> {
    return {
      items: all.items.map(SimpleCountRestrictionsMappers.DomainToDto),
    };
  }
}