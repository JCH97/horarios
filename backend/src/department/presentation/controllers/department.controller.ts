import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response } from '@nestjs/common';
import {
  CreateDepartmentUseCase, FindAllDepartmentUseCase,
  FindByIdDepartmentUseCase,
  FindDetailsDepartmentUseCase,
  PaginatedDepartmentUseCase,
  RemoveDepartmentUseCase,
  UpdateDepartmentUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Department } from '../../domain/entities/department.entity';
import { DepartmentPaginatedDto } from '../../application/dtos/department.paginated.dto';
import { DepartmentUpdateDto } from '../../application/dtos/department.update.dto';
import { DepartmentCreateDto } from '../../application/dtos/department.create.dto';
import { DepartmentMappers } from '../../infra/mappers/department.mappers';
import { UniversityFindAllDto } from '../../../university/application/dtos/university.find-all.dto';
import { UniversityMapper } from '../../../university/infra/mappers/university.mapper';
import { DepartmentFindAllDto } from '../../application/dtos/department.get-all.dto';

@Controller('department')
export class DepartmentController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdDepartmentUseCase,
    private readonly createDepartment: CreateDepartmentUseCase,
    private readonly updateDepartment: UpdateDepartmentUseCase,
    private readonly removeDepartment: RemoveDepartmentUseCase,
    private readonly paginatedDepartment: PaginatedDepartmentUseCase,
    private readonly findDetailsDepartment: FindDetailsDepartmentUseCase,
    private readonly findAllDepartment: FindAllDepartmentUseCase) {

    this._logger = new Logger('DepartmentController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const department = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Department>(res, department, DepartmentMappers.DomainToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const department = await this.findDetailsDepartment.execute({ id: params.id });
    return ProcessResponse.setResponse<Department>(res, department, DepartmentMappers.DomainToDetails);
  }


  @Post()
  async getAllPaginated(@Body() body: DepartmentPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedDepartment.execute(body);
    return ProcessResponse.setResponse(res, pag, DepartmentMappers.PaginatedToDto);
  }


  @Post('all')
  async getAll(@Body() body: DepartmentFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllDepartment.execute(body);
    return ProcessResponse.setResponse(res, ans, DepartmentMappers.PaginatedToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: DepartmentCreateDto, @Response() res) {

    this._logger.log('Create');

    const department = await this.createDepartment.execute(body);
    return ProcessResponse.setResponse<Department>(res, department, DepartmentMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() body: DepartmentUpdateDto, @Response() res) {
    this._logger.log('Update');

    const department = await this.updateDepartment.execute(body);
    return ProcessResponse.setResponse<Department>(res, department, DepartmentMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const department = await this.removeDepartment.execute(body);
    return ProcessResponse.setResponse<Department>(res, department, DepartmentMappers.DomainToDto);
  }
}
