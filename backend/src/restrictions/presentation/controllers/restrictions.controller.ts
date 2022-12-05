import { Controller, Get, Logger, Request, Response, Body, Post } from '@nestjs/common';
import { GetRestrictionsDescriptionsByTeacher, RestrictionsEvaluationUseCase } from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';

@Controller('restrictions')
export class RestrictionsController {
  private _logger: Logger;

  constructor(
    private readonly happiness: RestrictionsEvaluationUseCase,
    private readonly getRestrictionsDescriptionsByTeacher: GetRestrictionsDescriptionsByTeacher,
  ) {
    this._logger = new Logger('RestrictionsController');
  }

  @Get('happiness')
  async getHappiness(@Request() req, @Response() res) {
    this._logger.log('Get Happiness');

    const ans = await this.happiness.execute();

    return ProcessResponse.setResponse(res, ans);
  }

  @Post('descriptions')
  async getRestrictionsDescriptions(@Body() body, @Request() req, @Response() res) {
    this._logger.log('Get Restrictions Descriptions');

    const ans = await this.getRestrictionsDescriptionsByTeacher.execute({ teachers: body.teachers });

    return res.json(ans);
  }
}