import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { EnumActivitieType } from '../enums/enum.activitie.type';

type TypeClassProps = DomainBaseProps & DomainTimestamp & {
  type: EnumActivitieType,
  duration: number
}

type newTypeClassProps = Omit<TypeClassProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class TypeClass extends DomainEntity<TypeClassProps> {

  get shortName(): string {
    return this.props.shortName;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): number {
    return this.props.priority ?? 1;
  }

  get type(): EnumActivitieType {
    return this.props.type;
  }

  get duration(): number {
    return this.props.duration;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newTypeClassProps): Result<TypeClass> {
    const ans: Result<TypeClass> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: TypeClassProps, id: string = null): Result<TypeClass> {
    return Result.Ok(new TypeClass(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.type = props.type ?? this.props.type;
    this.props.duration = props.duration ?? this.props.duration;
    this.props.updatedAt = new Date();
  }
}
