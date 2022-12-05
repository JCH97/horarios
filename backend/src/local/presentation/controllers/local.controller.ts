import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateLocalUseCase,
  FindAllLocalUseCase,
  FindByIdLocalUseCase,
  PaginatedLocalUseCase,
  RemoveLocalUseCase,
  UpdateLocalUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Local } from '../../domain/entities/local.entity';
import { LocalPaginatedDto } from '../../application/dtos/local.paginated.dto';
import { LocalUpdateDto } from '../../application/dtos/local.update.dto';
import { LocalCreateDto } from '../../application/dtos/local.create.dto';
import { LocalMappers } from '../../infra/mappers/local.mappers';
import { LocalFindAllDto } from '../../application/dtos/local.find-all.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';

@Controller('local')
export class LocalController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdLocalUseCase,
    private readonly createLocalUseCase: CreateLocalUseCase,
    private readonly updateLocalUseCase: UpdateLocalUseCase,
    private readonly removeLocalUseCase: RemoveLocalUseCase,
    private readonly paginatedLocalUseCase: PaginatedLocalUseCase,
    private readonly findAll: FindAllLocalUseCase) {
    this._logger = new Logger('LocalController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const local = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Local>(res, local, LocalMappers.DomainToDto);

  }

  @Post()
  async getAllPaginated(@Body() body: LocalPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedLocalUseCase.execute(body);
    return ProcessResponse.setResponse(res, pag, LocalMappers.PaginatedToDto);
  }

  @Post('all')
  async getAll(@Body() body: LocalFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute(body);
    return ProcessResponse.setResponse(res, ans, LocalMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LOCAL)
  @Post('create')
  async create(@Body() body: LocalCreateDto, @Response() res) {

    this._logger.log('Create');

    const local = await this.createLocalUseCase.execute(body);
    return ProcessResponse.setResponse<Local>(res, local, LocalMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LOCAL)
  @Put()
  async update(@Body() body: LocalUpdateDto, @Response() res) {
    this._logger.log('Update');

    const local = await this.updateLocalUseCase.execute(body);
    return ProcessResponse.setResponse<Local>(res, local, LocalMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LOCAL)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const local = await this.removeLocalUseCase.execute(body);
    return ProcessResponse.setResponse<Local>(res, local, LocalMappers.DomainToDto);
  }


}
