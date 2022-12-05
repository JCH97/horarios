import { Body, Controller, Delete, Get, Logger, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import {
  BuildWhereUseCase,
  CreateRelationalRestrictionsUseCase,
  EvaluateRelationalRestrictionsUseCase,
  FindAllRelationalRestrictionsUseCase,
  FindByIdRelationalRestrictionUseCase,
  RemoveRelationalRestrictionsUseCase,
} from '../../application/useCases';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { RelationalRestrictionsMappers } from '../../infra/mappers/relational-restrictions.mappers';
import {
  RelationalRestrictionsCreateDto,
} from '../../application/dtos/relational-restrictions/relational-restrictions.create.dto';
import {
  RelationalRestrictionsFindAllDto,
} from '../../application/dtos/relational-restrictions/relational-restrictions.find-all.dto';

@Controller('restrictions/relational_restrictions')
export class RelationalRestrictionsController {

  private _logger: Logger;

  constructor(
    private readonly buildWhere: BuildWhereUseCase,
    private readonly create: CreateRelationalRestrictionsUseCase,
    private readonly evaluate: EvaluateRelationalRestrictionsUseCase,
    private readonly findAll: FindAllRelationalRestrictionsUseCase,
    private readonly remove: RemoveRelationalRestrictionsUseCase,
    private readonly findOne: FindByIdRelationalRestrictionUseCase,
  ) {
    this._logger = new Logger('RelationalRestrictionsController');
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

    return ProcessResponse.setResponse(res, cr, RelationalRestrictionsMappers.DomainToDto);
  }


  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Post('create')
  async createCountConditionRestrictions(@Body() body: RelationalRestrictionsCreateDto, @Request() req, @Response() res) {

    this._logger.log('Create');

    const cr = await this.create.execute({
      ...body,
      teacherId: { id: body.teacherId.id ?? req.user.id },
    });
    return ProcessResponse.setResponse(res, cr, RelationalRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async getAll(@Body() body: RelationalRestrictionsFindAllDto, @Response() res, @Request() req) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute({
      ...body,
      user: req.user,
    });

    return ProcessResponse.setResponse(res, ans, RelationalRestrictionsMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const rest = await this.remove.execute(body);
    return ProcessResponse.setResponse(res, rest, RelationalRestrictionsMappers.DomainToDto);
  }
}
