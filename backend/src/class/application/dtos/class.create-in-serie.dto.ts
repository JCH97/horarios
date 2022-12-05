import { ClassCreateDto } from './class.create.dto';
import { ClassFrequency } from '../../domain/enums/class-frecuency';

export type ClassCreateInSerieDto = Omit<ClassCreateDto, 'serieId'> & {
  frequency: string;
  days: number[];
}