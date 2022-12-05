import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateWeekUseCase,
  FindAllWeekUseCase,
  FindByIdWeekUseCase,
  FindDetailsWeekUseCase,
  RemoveWeekUseCase,
  UpdateWeekUseCase,
} from '../../application/useCases';
import { WeekMapper } from '../../infra/mappers/week.mapper';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { WeekCreateDto } from '../../application/dtos/week.create.dto';
import { Week } from '../../domain/entities/week.entity';
import { WeekUpdateDto } from '../../application/dtos/week.update.dto';
import { PaginatedWeekUseCase } from '../../application/useCases/week.paginated.use-case';
import { WeekPaginatedDto } from '../../application/dtos/week.paginated.dto';
import { WeekFindAllDto } from '../../application/dtos/week.find-all.dto';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';

@Controller('week')
export class WeekController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdWeekUseCase,
    private readonly createWeek: CreateWeekUseCase,
    private readonly updateWeek: UpdateWeekUseCase,
    private readonly removeWeek: RemoveWeekUseCase,
    private readonly paginatedWeek: PaginatedWeekUseCase,
    private readonly findAllWeek: FindAllWeekUseCase,
    private readonly findDetailsWeek: FindDetailsWeekUseCase) {
    this._logger = new Logger('WeekController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const week = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Week>(res, week, WeekMapper.DomainToDto);

  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find details');

    const week = await this.findDetailsWeek.execute({ id: params.id });
    return ProcessResponse.setResponse(res, week, WeekMapper.DomainToDetails);

  }

  @Post('all')
  async getAll(@Body() body: WeekFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllWeek.execute(body);
    return ProcessResponse.setResponse(res, ans, WeekMapper.PaginatedToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: WeekPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedWeek.execute(body);
    return ProcessResponse.setResponse(res, pag, WeekMapper.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_WEEK)
  @Post('create')
  async create(@Body() body: WeekCreateDto, @Response() res) {

    this._logger.log('Create');

    const week = await this.createWeek.execute(body);
    return ProcessResponse.setResponse<Week>(res, week, WeekMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_WEEK)
  @Put()
  async update(@Body() body: WeekUpdateDto, @Response() res) {
    this._logger.log('Update');

    const week = await this.updateWeek.execute(body);
    return ProcessResponse.setResponse<Week>(res, week, WeekMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_WEEK)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const week = await this.removeWeek.execute(body);
    return ProcessResponse.setResponse<Week>(res, week, WeekMapper.DomainToDto);
  }
}