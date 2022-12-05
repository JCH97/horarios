import { BaseRestriction, BaseRestrictionProps } from './base-restriction';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

type DistributionRestrictionProps = BaseRestrictionProps & {
  min: number;
  operator: string;
  attribute: string;
}

type NewDistributionRestrictionProps = Omit<DistributionRestrictionProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class DistributionRestrictions extends BaseRestriction<DistributionRestrictionProps> {

  get min(): number {
    return this.props.min;
  }

  get attribute(): string {
    return this.props.attribute;
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

  public static New(props: NewDistributionRestrictionProps): Result<DistributionRestrictions> {
    const ans: Result<DistributionRestrictions> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: DistributionRestrictionProps, id: string = null): Result<DistributionRestrictions> {
    return Result.Ok(new DistributionRestrictions(props, new UniqueEntityID(id)));
  }

  public evaluate(): any {
    // this.props.con
  }
}
