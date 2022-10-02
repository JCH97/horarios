import { Controller, Get, Logger, Request, Response } from '@nestjs/common';
import { RestrictionsEvaluationUseCase } from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';

@Controller('restrictions')
export class RestrictionsController {
  private _logger: Logger;

  constructor(
    private readonly happiness: RestrictionsEvaluationUseCase,
  ) {
    this._logger = new Logger('RestrictionsController');
  }

  @Get('happiness')
  async getHappiness(@Request() req, @Response() res) {
    this._logger.log('Get Happiness');

    const ans = await this.happiness.execute();

    return ProcessResponse.setResponse(res, ans);
  }
}