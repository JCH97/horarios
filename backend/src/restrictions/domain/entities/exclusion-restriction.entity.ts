import { BaseRestriction, BaseRestrictionProps } from './base-restriction';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AppError } from '../../../shared/core/errors/AppError';

type ExclusionRestrictionProps = BaseRestrictionProps & {
  attributes: string[];
}

type newCountRestrictionProps = Omit<ExclusionRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;


export class ExclusionRestrictions extends BaseRestriction<ExclusionRestrictionProps> {
  get attributes(): string [] {
    return this.props.attributes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newCountRestrictionProps): Result<ExclusionRestrictions> {
    const ans: Result<ExclusionRestrictions> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: ExclusionRestrictionProps, id: string = null): Result<ExclusionRestrictions> {

    if (props.interval == 0)
      return Result.Fail(new AppError.ValidationError('Interval cannot be 0'));

    return Result.Ok(new ExclusionRestrictions(props, new UniqueEntityID(id)));
  }

  public evaluate(): any {
    // this.props.con
  }
}
