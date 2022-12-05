import { PropsBaseDto } from '../../../shared/core/PropsBaseDto';

export type LocalUpdateDto = Partial<PropsBaseDto> & {
  localId: string
  capacity?: number;
}

