import { RestrictionType } from '../../domain/enums/restriction-type';

export type BaseRestrictionsDto = {
  id: string;
  conditions: {};
  teacherId: { id: string };
  interval: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  restrictionType: RestrictionType;
  description: string;
}