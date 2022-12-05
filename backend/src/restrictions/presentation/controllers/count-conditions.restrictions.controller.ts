import { Body, Controller, Delete, Get, Logger, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import {
  BuildWhereUseCase,
  CreateCountConditionsRestrictionsUseCase,
  EvaluateCountConditionsRestrictionsUseCase,
  FindAllCountConditionsRestrictionsUseCase,
  FindByIdCountConditionRestrictionUseCase,
  RemoveCountConditionsRestrictionsUseCase,
} from '../../application/useCases';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import {
  CountConditionsRestrictionsCreateDto,
} from '../../application/dtos/count-conditions-restrictions/count-conditions.create.dto';
import { CountConditionsRestrictionsMappers } from '../../infra/mappers/count-conditions.restrictions.mappers';
import {
  CountConditionsRestrictionsFindAllDto,
} from '../../application/dtos/count-conditions-restrictions/count-conditions.restrictions.find-all.dto';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';

@Controller('restrictions/count_conditions_restrictions')
export class CountConditionsRestrictionsController {

  private _logger: Logger;

  constructor(
    private readonly buildWhere: BuildWhereUseCase,
    private readonly create: CreateCountConditionsRestrictionsUseCase,
    private readonly evaluate: EvaluateCountConditionsRestrictionsUseCase,
    private readonly findAll: FindAllCountConditionsRestrictionsUseCase,
    private readonly remove: RemoveCountConditionsRestrictionsUseCase,
    private readonly findOne: FindByIdCountConditionRestrictionUseCase,
  ) {
    this._logger = new Logger('CountConditionsRestrictionsController');
  }

  @Get('evaluate')
  async conditionsRestrictions(@Request() req, @Response() res) {
    this._logger.log('Evaluate');

    let count = await this.evaluate.execute({ teacherId: req.user.id });

    return ProcessResponse.setResponse(res, count);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find_one/:id')
  async findOneSimpleCountRestrictions(@Param() params, @Request() req, @Response() res) {

    this._logger.log('Find One');

    const cr = await this.findOne.execute({
      id: params.id,
    });

    return ProcessResponse.setResponse(res, cr, CountConditionsRestrictionsMappers.DomainToDto);
  }


  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Post('create')
  async createCountConditionRestrictions(@Body() body: CountConditionsRestrictionsCreateDto, @Request() req, @Response() res) {

    this._logger.log('Create');

    const cr = await this.create.execute({
      ...body,
      teacherId: { id: body.teacherId.id ?? req.user.id },
    });
    return ProcessResponse.setResponse(res, cr, CountConditionsRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async getAll(@Body() body: CountConditionsRestrictionsFindAllDto, @Response() res, @Request() req) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute({
      ...body,
      user: req.user,
    });

    return ProcessResponse.setResponse(res, ans, CountConditionsRestrictionsMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const rest = await this.remove.execute(body);
    return ProcessResponse.setResponse(res, rest, CountConditionsRestrictionsMappers.DomainToDto);
  }
}
