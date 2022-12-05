import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateUniversityUseCase,
  FindAllUniversityUseCase,
  FindByIdUniversityUseCase,
  RemoveUniversityUseCase,
  UpdateUniversityUseCase,
} from '../../application/useCases';
import { UniversityMapper } from '../../infra/mappers/university.mapper';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { UniversityCreateDto } from '../../application/dtos/university.create.dto';
import { University } from '../../domain/entities/university.entity';
import { UniversityUpdateDto } from '../../application/dtos/university.update.dto';
import { PaginatedUniversityUseCase } from '../../application/useCases/university.paginated.use-case';
import { UniversityPaginatedDto } from '../../application/dtos/university.paginated.dto';
import { UniversityFindAllDto } from '../../application/dtos/university.find-all.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';

@Controller('university')
export class UniversityController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdUniversityUseCase,
    private readonly createUniversity: CreateUniversityUseCase,
    private readonly updateUniversity: UpdateUniversityUseCase,
    private readonly removeUniversity: RemoveUniversityUseCase,
    private readonly paginatedUniversity: PaginatedUniversityUseCase,
    private readonly findAllUniversity: FindAllUniversityUseCase) {
    this._logger = new Logger('UniversityController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const university = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<University>(res, university, UniversityMapper.DomainToDto);

  }

  @Post('all')
  async getAll(@Body() body: UniversityFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllUniversity.execute(body);
    return ProcessResponse.setResponse(res, ans, UniversityMapper.PaginatedToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: UniversityPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedUniversity.execute(body);
    return ProcessResponse.setResponse(res, pag, UniversityMapper.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_UNIVERSITY)
  @Post('create')
  async create(@Body() body: UniversityCreateDto, @Response() res) {

    this._logger.log('Create');

    const university = await this.createUniversity.execute(body);
    return ProcessResponse.setResponse<University>(res, university, UniversityMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_UNIVERSITY)
  @Put()
  async update(@Body() body: UniversityUpdateDto, @Response() res) {
    this._logger.log('Update');

    const university = await this.updateUniversity.execute(body);
    return ProcessResponse.setResponse<University>(res, university, UniversityMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_UNIVERSITY)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const university = await this.removeUniversity.execute(body);
    return ProcessResponse.setResponse<University>(res, university, UniversityMapper.DomainToDto);
  }

}