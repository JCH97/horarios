import { BaseRestriction, BaseRestrictionProps } from './base-restriction';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AppError } from '../../../shared/core/errors/AppError';

type SimpleCountRestrictionProps = BaseRestrictionProps & {
  min?: number;
  part?: number;
  operator: string;
}

type newCountRestrictionProps = Omit<SimpleCountRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;


export class SimpleCountRestrictions extends BaseRestriction<SimpleCountRestrictionProps> {

  get min(): number {
    return this.props.min;
  }

  get part(): number {
    return this.props.part;
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

  public static New(props: newCountRestrictionProps): Result<SimpleCountRestrictions> {
    const ans: Result<SimpleCountRestrictions> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: SimpleCountRestrictionProps, id: string = null): Result<SimpleCountRestrictions> {

    if (props.interval == 0)
      return Result.Fail(new AppError.ValidationError('Interval cannot be 0'));

    if (props.min == null && props.part == null)
      return Result.Fail(new AppError.ValidationError('Min or part must be defined'));

    return Result.Ok(new SimpleCountRestrictions(props, new UniqueEntityID(id)));
  }

  public evaluate(): any {
    // this.props.con
  }
}