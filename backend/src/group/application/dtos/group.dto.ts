import { BaseDto } from '../../../shared/core/BaseDto';
import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';
import { MajorDto } from '../../../major/application/dtos/major.dto';
import { MajorDetailsDto } from '../../../major/application/dtos/major.details.dto';

export type GroupDto = BaseDto & PropsBaseDto & {
  year: number;
  majorId?: {id: string};
  color: string;
}