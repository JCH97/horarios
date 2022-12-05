import { RestrictionType } from '../../domain/enums/restriction-type';

export type HappinessDto = {
  happiness: number;
  breachedRestrictions: BreachedRestrictionDto[];
};

export type BreachedRestrictionDto = {
  id: string;
  teacherId: string;
  restrictionType: RestrictionType;
}