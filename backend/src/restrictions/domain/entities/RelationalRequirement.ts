import { BaseRestriction, BaseRestrictionProps } from './base-restriction';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AppError } from '../../../shared/core/errors/AppError';

type RelationalRestrictionProps = BaseRestrictionProps & {
  attribute: string;
  subConditions: {};
  operator: string;
}

type newCountRestrictionProps = Omit<RelationalRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;


export class RelationalRestrictions extends BaseRestriction<RelationalRestrictionProps> {

  get attribute(): string {
    return this.props.attribute;
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

  public static New(props: newCountRestrictionProps): Result<RelationalRestrictions> {
    const ans: Result<RelationalRestrictions> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: RelationalRestrictionProps, id: string = null): Result<RelationalRestrictions> {

    if (props.interval == 0)
      return Result.Fail(new AppError.ValidationError('Interval cannot be 0'));

    return Result.Ok(new RelationalRestrictions(props, new UniqueEntityID(id)));
  }

  public evaluate(): any {
    // this.props.con
  }
}
