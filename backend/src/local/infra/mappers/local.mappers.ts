import {LocalPersistence} from '../entities/local.persistence';
import {Local} from '../../domain/entities/local.entity';
import {LocalDto} from '../../application/dtos/local.dto';
import {PaginatedFindResult} from '../../../shared/core/PaginatedFindResult';

export class LocalMappers {
    public static PersistToDomain(persist: LocalPersistence): Local {
        const domain = Local.Create({
            ...persist,
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
}
