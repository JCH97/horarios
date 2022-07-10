import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response } from '@nestjs/common';
import {
  CreateMajorUseCase, FindAllMajorUseCase,
  FindByIdMajorUseCase, FindDetailsMajorUseCase,
  PaginatedMajorUseCase,
  RemoveMajorUseCase,
  UpdateMajorUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Major } from '../../domain/entities/major.entity';
import { MajorPaginatedDto } from '../../application/dtos/major.paginated.dto';
import { MajorUpdateDto } from '../../application/dtos/major.update.dto';
import { MajorCreateDto } from '../../application/dtos/major.create.dto';
import { MajorMappers } from '../../infra/mappers/major.mappers';
import { FacultyFindAllDto } from '../../../faculty/application/dtos/faculty.find-all.dto';
import { FacultyMappers } from '../../../faculty/infra/mappers/faculty.mappers';
import { Teacher } from '../../../teacher/domain/entities/teacher.entity';
import { TeacherMappers } from '../../../teacher/infra/mappers/teacher.mappers';

@Controller('major')
export class MajorController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdMajorUseCase,
    private readonly createMajorUseCase: CreateMajorUseCase,
    private readonly updateMajorUseCase: UpdateMajorUseCase,
    private readonly removeMajorUseCase: RemoveMajorUseCase,
    private readonly paginatedMajorUseCase: PaginatedMajorUseCase,
    private readonly findAllMajor: FindAllMajorUseCase,
    private readonly findDetailsUseCase: FindDetailsMajorUseCase) {
    this._logger = new Logger('MajorController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const major = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Major>(res, major, MajorMappers.DomainToDto);

  }

  @Post()
  async getAllPaginated(@Body() body: MajorPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedMajorUseCase.execute(body);
    return ProcessResponse.setResponse(res, pag, MajorMappers.PaginatedToDto);
  }

  @Post('all')
  async getAll(@Body() body: FacultyFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllMajor.execute(body);
    return ProcessResponse.setResponse(res, ans, MajorMappers.AllToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const major = await this.findDetailsUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Major>(res, major, MajorMappers.DomainToDetails);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: MajorCreateDto, @Response() res) {
    this._logger.log('Create');

    const major = await this.createMajorUseCase.execute(body);
    return ProcessResponse.setResponse<Major>(res, major, MajorMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() body: MajorUpdateDto, @Response() res) {
    this._logger.log('Update');

    const major = await this.updateMajorUseCase.execute(body);
    return ProcessResponse.setResponse<Major>(res, major, MajorMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const major = await this.removeMajorUseCase.execute(body);
    return ProcessResponse.setResponse<Major>(res, major, MajorMappers.DomainToDto);
  }


}
