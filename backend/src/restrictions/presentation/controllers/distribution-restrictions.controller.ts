import { Body, Controller, Delete, Get, Logger, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import {
  BuildWhereUseCase,
  CreateDistributionRestrictionUseCase,
  EvaluateDistributionRestrictionUseCase,
  FindAllDistributionRestrictionsUseCase,
  FindByIdDistributionRestrictionUseCase,
  RemoveDistributionRestrictionsUseCase,
} from '../../application/useCases';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { DistributionRestrictionsMappers } from '../../infra/mappers/distribution-restrictions.mappers';
import {
  DistributionRestrictionsCreateDto,
} from '../../application/dtos/distribution-restrictions/distribution-restrictions.create.dto';
import {
  DistributionRestrictionsFindAllDto,
} from '../../application/dtos/distribution-restrictions/distribution-restrictions.find-all.dto';

@Controller('restrictions/distribution_restrictions')
export class DistributionRestrictionsController {

  private _logger: Logger;

  constructor(
    private readonly buildWhere: BuildWhereUseCase,
    private readonly create: CreateDistributionRestrictionUseCase,
    private readonly evaluate: EvaluateDistributionRestrictionUseCase,
    private readonly remove: RemoveDistributionRestrictionsUseCase,
    private readonly findAll: FindAllDistributionRestrictionsUseCase,
    private readonly findOne: FindByIdDistributionRestrictionUseCase,
  ) {
    this._logger = new Logger('DistributionRestrictionsController');
  }

  // @UseGuards(JwtAuthGuard)
  @Get('evaluate')
  async distributionConditions(@Request() req, @Response() res) {
    this._logger.log('EvaluateDistributionRestrictions');

    let count = await this.evaluate.execute({ teacherId: req.user.id });

    return ProcessResponse.setResponse(res, count);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find_one/:id')
  async findOneDistributionRestrictions(@Param() params, @Request() req, @Response() res) {

    this._logger.log('Find One');

    const cr = await this.findOne.execute({
      id: params.id,
    });

    return ProcessResponse.setResponse(res, cr, DistributionRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Post('create')
  async createDistributionRestrictions(@Body() body: DistributionRestrictionsCreateDto, @Request() req, @Response() res) {

    this._logger.log('Create');

    const cr = await this.create.execute({
      ...body,
      teacherId: { id: body.teacherId.id ?? req.user.id },
    });
    return ProcessResponse.setResponse(res, cr, DistributionRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async getAll(@Body() body: DistributionRestrictionsFindAllDto, @Response() res, @Request() req) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute({
      ...body,
      user: req.user,
    });
    return ProcessResponse.setResponse(res, ans, DistributionRestrictionsMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const rest = await this.remove.execute(body);
    return ProcessResponse.setResponse(res, rest, DistributionRestrictionsMappers.DomainToDto);
  }
}
