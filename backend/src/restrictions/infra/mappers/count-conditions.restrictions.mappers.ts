import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { CountConditionsRestrictions } from '../../domain/entities/count-conditions.restrictions.entity';
import { CountConditionsRestrictionsPersistence } from '../entities/count-conditions.restrictions.persistence';
import {
  CountConditionsRestrictionsDto,
} from '../../application/dtos/count-conditions-restrictions/count-conditions-restrictions.dto';
import { FindAllResult } from '../../../shared/core/FindAllResult';

export class CountConditionsRestrictionsMappers {
  public static PersistToDomain(persist: CountConditionsRestrictionsPersistence): CountConditionsRestrictions {
    const domain = CountConditionsRestrictions.Create({
      ...persist,
      conditions: JSON.parse(persist.conditions),
      subConditions: JSON.parse(persist.subConditions),
      teacherId: { id: persist.teacherId },
    }, persist.id);

    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }


  public static DomainToPersist(domain: CountConditionsRestrictions): Partial<CountConditionsRestrictionsPersistence> {
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
      part: domain.part,
      operator: domain.operator,
      description: domain.description
    };
  }

  public static DomainToDto(domain: CountConditionsRestrictions): CountConditionsRestrictionsDto {
    return {
      id: domain._id.toString(),
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      conditions: domain.condition,
      interval: domain.interval,
      part: domain.part,
      subConditions: domain.subConditions,
      teacherId: domain.teacherId,
      operator: domain.operator,
      restrictionType: domain.restrictionType,
      description: domain.description
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<CountConditionsRestrictions>): PaginatedFindResult<CountConditionsRestrictionsDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(CountConditionsRestrictionsMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: CountConditionsRestrictions): CountConditionsRestrictionsDto {
    let base = CountConditionsRestrictionsMappers.DomainToDto(domain);

    return {
      ...base,
    };
  }

  public static AllToDto(all: FindAllResult<CountConditionsRestrictions>): FindAllResult<CountConditionsRestrictionsDto> {
    return {
      items: all.items.map(CountConditionsRestrictionsMappers.DomainToDto),
    };
  }

}
