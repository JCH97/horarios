import { TypeclassPersistence } from '../entities/typeclass.persistence';
import { TypeClass } from '../../domain/entities/typeclass.entity';
import { TypeclassDto } from '../../application/dtos/typeclass.dto';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { TypeClassDetailsDto } from '../../application/dtos/typeclass.details.dto';
import { FindAllResult } from '../../../shared/core/FindAllResult';

export class TypeclassMappers {
  public static PersistToDomain(persist: TypeclassPersistence): TypeClass {
    const domain = TypeClass.Create({
      ...persist,
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: TypeClass): Partial<TypeclassPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      type: domain.type,
      duration: domain.duration,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  public static DomainToDto(domain: TypeClass): TypeclassDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      duration: domain.duration,
      type: domain.type,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }


  public static AllToDto(all: FindAllResult<TypeClass>): FindAllResult<TypeclassDto> {
    return {
      items: all.items.map(TypeclassMappers.DomainToDto),
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<TypeClass>): PaginatedFindResult<TypeclassDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(TypeclassMappers.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }

  public static DomainToDetails(domain: TypeClass): TypeClassDetailsDto {
    let base = TypeclassMappers.DomainToDto(domain);
    return base;
  }
}
