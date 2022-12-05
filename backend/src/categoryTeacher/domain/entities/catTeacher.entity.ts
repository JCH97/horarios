import { DomainBaseProps } from '../../../shared/domain/domain.base-props';
import { DomainTimestamp } from '../../../shared/domain/domain.timestamp';
import { DomainEntity } from '../../../shared/domain/entity.abstract';
import { Result } from '../../../shared/core/Result';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

type CatTeacherProps = DomainBaseProps & DomainTimestamp & {
  categoryName: string
};

type newCatTeacherProps = Omit<CatTeacherProps,
  'id' | 'createdAt' | 'updatedAt'>;

export class CatTeacher extends DomainEntity<CatTeacherProps> {

  get shortName(): string {
    return this.props.shortName;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get categoryName(): string {
    return this.props.categoryName;
  }

  get description(): string {
    return this.props.description;
  }

  get priority(): number {
    return this.props.priority ?? 1;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newCatTeacherProps): Result<CatTeacher> {
    const ans: Result<CatTeacher> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: CatTeacherProps, id: string = null): Result<CatTeacher> {
    // set guards here
    return Result.Ok(new CatTeacher(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.priority = props.priority ?? this.props.priority;
    this.props.description = props.description ?? this.props.description;
    this.props.fullName = props.fullName ?? this.props.fullName;
    this.props.shortName = props.shortName ?? this.props.shortName;
    this.props.categoryName = props.categoryName ?? this.props.categoryName;

    this.props.updatedAt = new Date();
  }
}
