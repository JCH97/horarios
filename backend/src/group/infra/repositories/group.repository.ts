import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../shared/modules/data-access/typeorm/base.respository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../domain/entities/group.entity';
import { GroupPersistence } from '../entities/group.persistence';
import { IGroupRepository } from '../../domain/interfaces/IGroupRepository';
import { GroupMappers } from '../mappers/group.mapper';

@Injectable()
export class GroupRepository extends BaseRepository<Group, GroupPersistence> implements IGroupRepository {
  constructor(@InjectRepository(GroupPersistence) _repository: Repository<GroupPersistence>) {
    super(_repository, GroupMappers.DomainToPersist, GroupMappers.PersistToDomain, 'GroupRepository');
  }

  async findDetails(id: string): Promise<Group> {
    const group = await this
      ._entityRepository
      .findOne(id, {
        relations: ['major', 'major.faculty', 'major.faculty.university'],
      });

    return GroupMappers.PersistToDomain(group);
  }
}
