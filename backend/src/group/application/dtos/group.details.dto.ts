import { GroupDto } from './group.dto';
import { MajorDto } from '../../../major/application/dtos/major.dto';
import { MajorDetailsDto } from '../../../major/application/dtos/major.details.dto';

export type GroupDetailsDto = GroupDto & {
  major: MajorDetailsDto;
}