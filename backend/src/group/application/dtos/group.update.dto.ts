import { GroupDto } from './group.dto';

export type GroupUpdateDto = Omit<Partial<GroupDto>, 'id'> & {
  groupId: string;
  majorId?: { id: string };
};
