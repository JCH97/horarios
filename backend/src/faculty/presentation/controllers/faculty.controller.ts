import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response } from '@nestjs/common';
import {
  CreateFacultyUseCase,
  FindByIdFacultyUseCase,
  PaginatedFacultyUseCase,
  RemoveFacultyUseCase,
  UpdateFacultyUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Faculty } from '../../domain/entities/faculty.entity';
import { FacultyPaginatedDto } from '../../application/dtos/faculty.paginated.dto';
import { FacultyUpdateDto } from '../../application/dtos/faculty.update.dto';
import { FacultyCreateDto } from '../../application/dtos/faculty.create.dto';
import { FacultyMappers } from '../../infra/mappers/faculty.mappers';

@Controller('faculty')
export class FacultyController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdFacultyUseCase,
    private readonly createFaculty: CreateFacultyUseCase,
    private readonly updateFaculty: UpdateFacultyUseCase,
    private readonly removeFaculty: RemoveFacultyUseCase,
    private readonly paginatedFaculty: PaginatedFacultyUseCase) {

    this._logger = new Logger('FacultyController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const university = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Faculty>(res, university, FacultyMappers.DomainToDto);

  }

  @Post()
  async getAllPaginated(@Body() body: FacultyPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedFaculty.execute(body);
    return ProcessResponse.setResponse(res, pag, (a) => a);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: FacultyCreateDto, @Response() res) {

    this._logger.log('Create');

    const university = await this.createFaculty.execute(body);
    return ProcessResponse.setResponse<Faculty>(res, university, FacultyMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() body: FacultyUpdateDto, @Response() res) {
    this._logger.log('Update');

    const university = await this.updateFaculty.execute(body);
    return ProcessResponse.setResponse<Faculty>(res, university, FacultyMappers.DomainToDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const university = await this.removeFaculty.execute(body);
    return ProcessResponse.setResponse<Faculty>(res, university, FacultyMappers.DomainToDto);
  }


}