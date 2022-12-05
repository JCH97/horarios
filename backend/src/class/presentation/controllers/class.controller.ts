import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateClassUseCase,
  CreteMultipleClassInSameSerieUseCase,
  FindAllClassUseCase,
  FindByIdClassUseCase,
  FindDetailsClassUseCase,
  PaginatedClassUseCase,
  QueryClassUseCase,
  RemoveClassUseCase,
  RemoveInSerieClassUseCase,
  UpdateClassUseCase,
  UpdateMultipleClassByFieldsUseCase,
  UpdateMultipleClassInSameSerieByDropUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Class } from '../../domain/entities/class.entity';
import { ClassPaginatedDto } from '../../application/dtos/class.paginated.dto';
import { ClassUpdateDto } from '../../application/dtos/class.update.dto';
import { ClassCreateDto } from '../../application/dtos/class.create.dto';
import { ClassMappers } from '../../infra/mappers/class.mapper';
import { FacultyFindAllDto } from '../../../faculty/application/dtos/faculty.find-all.dto';
import { ClassUpdateMultipleInSameSerieDto } from '../../application/dtos/class-update-multiple-in-same-serie.dto';
import { ClassQueryDto } from '../../application/dtos/class.query.dto';
import { ClassCreateInSerieDto } from '../../application/dtos/class.create-in-serie.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { v4 } from 'uuid';

@Controller('class')
export class ClassController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdClassUseCase,
    private readonly createClass: CreateClassUseCase,
    private readonly updateClass: UpdateClassUseCase,
    private readonly removeClass: RemoveClassUseCase,
    private readonly paginatedClass: PaginatedClassUseCase,
    private readonly findDetailsClass: FindDetailsClassUseCase,
    private readonly findAllClass: FindAllClassUseCase,
    private readonly updateMultipleClass: UpdateMultipleClassInSameSerieByDropUseCase,
    private readonly removeInSerie: RemoveInSerieClassUseCase,
    private readonly queryClass: QueryClassUseCase,
    private readonly createInSerie: CreteMultipleClassInSameSerieUseCase,
    private readonly updateByFields: UpdateMultipleClassByFieldsUseCase) {

    this._logger = new Logger('ClassController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const c = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Class>(res, c, ClassMappers.DomainToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const c = await this.findDetailsClass.execute({ id: params.id });
    return ProcessResponse.setResponse<Class>(res, c, ClassMappers.DomainToDetails);
  }

  @Post('all')
  async getAll(@Body() body: FacultyFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllClass.execute(body);
    return ProcessResponse.setResponse(res, ans, ClassMappers.AllToDto);
  }

  @Post('query')
  async getQuery(@Body() body: ClassQueryDto, @Response() res) {
    this._logger.log('Get with query');

    const ans = await this.queryClass.execute(body);
    return ProcessResponse.setResponse(res, ans, ClassMappers.AllToDto);
  }


  @Post()
  async getAllPaginated(@Body() body: ClassPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedClass.execute(body);
    return ProcessResponse.setResponse(res, pag, ClassMappers.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.CREATE_EVENT)
  @Post('create')
  async create(@Body() body: ClassCreateDto, @Response() res) {

    this._logger.log('Create');

    const c = await this.createClass.execute(body);
    return ProcessResponse.setResponse<Class>(res, c, ClassMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.CREATE_EVENT)
  @Post('create/multiple')
  async createMultiple(@Body() body: ClassCreateInSerieDto, @Response() res) {
    this._logger.log('Create in serie');

    const c = await this.createInSerie.execute(body);
    return ProcessResponse.setResponse(res, c);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.UPDATE_EVENT)
  @Put()
  async update(@Body() body: ClassUpdateDto, @Response() res) {
    this._logger.log('Update');

    body.serieId = v4();
    const c = await this.updateClass.execute(body);
    return ProcessResponse.setResponse<Class>(res, c, ClassMappers.DomainToDto);
  }


  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.CREATE_EVENT)
  @Put('multiple')
  async updateMultiple(@Body() body: ClassUpdateMultipleInSameSerieDto, @Response() res) {
    this._logger.log('Update in serie');

    const c = await this.updateMultipleClass.execute(body);
    return ProcessResponse.setResponse<Class>(res, c, a => a);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.CREATE_EVENT)
  @Put('multiple_by_fields')
  async updateMultipleByFields(@Body() body: ClassUpdateDto, @Response() res) {
    this._logger.log('Update in serie');

    const c = await this.updateByFields.execute(body);
    return ProcessResponse.setResponse<Class>(res, c, a => a);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.DELETE_EVENT)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const c = await this.removeClass.execute(body);
    return ProcessResponse.setResponse<Class>(res, c, ClassMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.DELETE_EVENT)
  @Delete('in_serie')
  async deleteInSerie(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete In Serie');

    const c = await this.removeInSerie.execute(body);
    return ProcessResponse.setResponse<number | any>(res, c, a => a);
  }
}
