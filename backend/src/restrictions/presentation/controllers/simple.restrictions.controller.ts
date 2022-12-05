import { Body, Controller, Delete, Get, Logger, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import {
  BuildWhereUseCase,
  CreateSimpleCountRestrictionUseCase,
  EvaluateSimpleCountRestrictionUseCase,
  FindAllSimpleCountRestrictionsUseCase,
  FindByIdSimpleCountRestrictionUseCase,
  RemoveSimpleCountRestrictionsUseCase,
} from '../../application/useCases';
import { SimpleCountRestrictionsMappers } from '../../infra/mappers/simple-count-restrictions.mappers';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { CountRestrictionsCreateDto } from '../../application/dtos/count-restrictions/count-restrictions.create.dto';
import {
  SimpleCountRestrictionsFindAllDto,
} from '../../application/dtos/count-restrictions/count-restriction.find-all.dto';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';

@Controller('restrictions/simple_count_restrictions')
export class SimpleRestrictionsController {

  private _logger: Logger;

  constructor(
    private readonly buildWhere: BuildWhereUseCase,
    private readonly create: CreateSimpleCountRestrictionUseCase,
    private readonly evaluate: EvaluateSimpleCountRestrictionUseCase,
    private readonly remove: RemoveSimpleCountRestrictionsUseCase,
    private readonly findAll: FindAllSimpleCountRestrictionsUseCase,
    private readonly findOne: FindByIdSimpleCountRestrictionUseCase,
  ) {
    this._logger = new Logger('SimpleRestrictionsController');
  }

  // @UseGuards(JwtAuthGuard)
  @Get('evaluate')
  async simpleConditions(@Request() req, @Response() res) {
    this._logger.log('EvaluateSimpleCountRestrictions');

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

    return ProcessResponse.setResponse(res, cr, SimpleCountRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Post('create')
  async createSimpleCountRestrictions(@Body() body: CountRestrictionsCreateDto, @Request() req, @Response() res) {

    this._logger.log('Create');

    const cr = await this.create.execute({
      ...body,
      teacherId: { id: body.teacherId.id ?? req.user.id },
    });

    return ProcessResponse.setResponse(res, cr, SimpleCountRestrictionsMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('all')
  async getAll(@Body() body: SimpleCountRestrictionsFindAllDto, @Response() res, @Request() req) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute({
      ...body,
      user: req.user,
    });
    return ProcessResponse.setResponse(res, ans, SimpleCountRestrictionsMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_RESTRICTIONS)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const rest = await this.remove.execute(body);
    return ProcessResponse.setResponse(res, rest, SimpleCountRestrictionsMappers.DomainToDto);
  }
}