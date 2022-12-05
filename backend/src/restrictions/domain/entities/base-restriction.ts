import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { RestrictionType } from '../enums/restriction-type';

export type BaseRestrictionProps = DomainTimestamp & {
  conditions: {},
  interval: number,
  priority: number,
  teacherId: { id: string },
  teacher?: Teacher
  restrictionType: RestrictionType;
  description: string;
};

type newBaseRestrictionProps = Omit<BaseRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;

export abstract class BaseRestriction<T> extends DomainEntity<T & BaseRestrictionProps> {
  get condition(): {} {
    return this.props.conditions;
  }

  get interval(): number {
    return this.props.interval;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): number {
    return this.props.priority;
  }

  get teacherId(): { id: string } {
    return this.props.teacherId;
  }

  get teacher(): Teacher {
    return this.props.teacher;
  }

  get restrictionType(): RestrictionType {
    return this.props.restrictionType;
  }

  public abstract evaluate(): any;
}
