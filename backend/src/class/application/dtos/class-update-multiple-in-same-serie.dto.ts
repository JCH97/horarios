import { ClassUpdateDto } from './class.update.dto';

export type ClassUpdateMultipleInSameSerieDto = {
  serieId: string;
  originalClass: ClassUpdateDto;
  toUpdateClass: ClassUpdateDto;
}