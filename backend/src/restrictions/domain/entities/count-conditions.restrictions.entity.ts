import { BaseRestriction, BaseRestrictionProps } from './base-restriction';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AppError } from '../../../shared/core/errors/AppError';

type CountConditionsRestrictionProps = BaseRestrictionProps & {
  part: number;
  subConditions: {};
  operator: string;
}

type newCountRestrictionProps = Omit<CountConditionsRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;


export class CountConditionsRestrictions extends BaseRestriction<CountConditionsRestrictionProps> {

  get part(): number {
    return this.props.part;
  }

  get subConditions(): {} {
    return this.props.subConditions;
  }

  get operator(): string {
    return this.props.operator;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newCountRestrictionProps): Result<CountConditionsRestrictions> {
    const ans: Result<CountConditionsRestrictions> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: CountConditionsRestrictionProps, id: string = null): Result<CountConditionsRestrictions> {

    if (props.interval == 0)
      return Result.Fail(new AppError.ValidationError('Interval cannot be 0'));

    return Result.Ok(new CountConditionsRestrictions(props, new UniqueEntityID(id)));
  }

  public evaluate(): any {
    // this.props.con
  }
}
