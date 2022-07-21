import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response } from '@nestjs/common';
import {
  CreateSemesterUseCase,
  FindAllSemesterUseCase,
  FindByIdSemesterUseCase, FindDetailsSemesterUseCase,
  RemoveSemesterUseCase,
  UpdateSemesterUseCase,
} from '../../application/useCases';
import { SemesterMapper } from '../../infra/mappers/semester.mapper';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { SemesterCreateDto } from '../../application/dtos/semester.create.dto';
import { Semester } from '../../domain/entities/semester.entity';
import { SemesterUpdateDto } from '../../application/dtos/semester.update.dto';
import { PaginatedSemesterUseCase } from '../../application/useCases/semester.paginated.use-case';
import { SemesterPaginatedDto } from '../../application/dtos/semester.paginated.dto';
import { SemesterFindAllDto } from '../../application/dtos/semester.find-all.dto';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';

@Controller('semester')
export class SemesterController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdSemesterUseCase,
    private readonly createSemester: CreateSemesterUseCase,
    private readonly updateSemester: UpdateSemesterUseCase,
    private readonly removeSemester: RemoveSemesterUseCase,
    private readonly paginatedSemester: PaginatedSemesterUseCase,
    private readonly findAllSemester: FindAllSemesterUseCase,
    private readonly findDetailsSemester: FindDetailsSemesterUseCase) {
    this._logger = new Logger('SemesterController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const semester = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Semester>(res, semester, SemesterMapper.DomainToDto);

  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find details');

    const semester = await this.findDetailsSemester.execute({ id: params.id });
    return ProcessResponse.setResponse(res, semester, SemesterMapper.DomainToDetails);

  }

  @Post('all')
  async getAll(@Body() body: SemesterFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllSemester.execute(body);
    return ProcessResponse.setResponse(res, ans, SemesterMapper.PaginatedToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: SemesterPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedSemester.execute(body);
    return ProcessResponse.setResponse(res, pag, SemesterMapper.PaginatedToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: SemesterCreateDto, @Response() res) {

    this._logger.log('Create');

    const semester = await this.createSemester.execute(body);
    return ProcessResponse.setResponse<Semester>(res, semester, SemesterMapper.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() body: SemesterUpdateDto, @Response() res) {
    this._logger.log('Update');

    const semester = await this.updateSemester.execute(body);
    return ProcessResponse.setResponse<Semester>(res, semester, SemesterMapper.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const semester = await this.removeSemester.execute(body);
    return ProcessResponse.setResponse<Semester>(res, semester, SemesterMapper.DomainToDto);
  }

}