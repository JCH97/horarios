import { WeekPersistence } from '../entities/week.persistence';
import { Week } from '../../domain/entities/week.entity';
import { WeekDto } from '../../application/dtos/week.dto';
import { PaginatedFindResult } from '../../../shared/core/PaginatedFindResult';
import { SemesterMapper } from '../../../semester/infra/mappers/semester.mapper';
import { WeekDetailsDto } from '../../application/dtos/week.details.dto';

export class WeekMapper {
  public static PersistToDomain(persist: WeekPersistence): Week {
    const domain = Week.Create({
      ...persist,
      semesterId: { id: persist.semesterId },
      semester: persist.semester ? SemesterMapper.PersistToDomain(persist.semester) : null,
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: Week): Partial<WeekPersistence> {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      duration: domain.duration,
      firstDate: domain.firstDate,
      endDate: domain.endDate,
      semester: domain.semesterId,
      number: domain.number,
    };
  }

  public static DomainToDto(domain: Week): WeekDto {
    return {
      id: domain._id.toString(),
      shortName: domain.shortName,
      fullName: domain.fullName,
      description: domain.description,
      priority: domain.priority,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      duration: domain.duration,
      firstDate: domain.firstDate,
      endDate: domain.endDate,
      number: domain.number,
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Week>): PaginatedFindResult<WeekDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(WeekMapper.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage,
    };
  }


  public static DomainToDetails(domain: Week): WeekDetailsDto {
    let base = WeekMapper.DomainToDto(domain);

    return {
      ...base,
      semester: domain.semester ? SemesterMapper.DomainToDetails(domain.semester) : null,
    };
  }

}