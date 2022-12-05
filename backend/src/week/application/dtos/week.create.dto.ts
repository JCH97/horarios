import { WeekDto } from './week.dto';

export type WeekCreateDto = WeekDto & {
  semesterId: { id: string };
};
