import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';

import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { TypeClass } from '../../domain/entities/typeclass.entity';
import { TypeclassPaginatedDto } from '../../application/dtos/typeclass.paginated.dto';
import { TypeclassUpdateDto } from '../../application/dtos/typeclass.update.dto';
import { TypeclassCreateDto } from '../../application/dtos/typeclass.create.dto';
import { TypeclassMappers } from '../../infra/mappers/typeclass.mappers';
import {
  CreateTypeClassUseCase,
  FindAllTypeClassUseCase,
  FindByIdTypeClassUseCase,
  RemoveTypeClassUseCase,
  TypeClassPaginatedUseCase,
  UpdateTypeClassUseCase,
} from '../../application/useCases';
import { TypeClassFindAllDto } from '../../application/dtos/typeclass.find-all.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';

@Controller('typeclass')
export class TypeClassController {

  private _logger: Logger;

  constructor(
    private readonly findByIdTypeClassUseCase: FindByIdTypeClassUseCase,
    private readonly createTypeClassUseCase: CreateTypeClassUseCase,
    private readonly updateTypeClassUseCase: UpdateTypeClassUseCase,
    private readonly removeTypeClassUseCase: RemoveTypeClassUseCase,
    private readonly typeClassPaginatedUseCase: TypeClassPaginatedUseCase,
    private readonly findAll: FindAllTypeClassUseCase) {
    this._logger = new Logger('TypeClassController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const university = await this.findByIdTypeClassUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<TypeClass>(res, university, TypeclassMappers.DomainToDto);

  }

  @Post()
  async getAllPaginated(@Body() body: TypeclassPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.typeClassPaginatedUseCase.execute(body);
    return ProcessResponse.setResponse(res, pag, TypeclassMappers.PaginatedToDto);
  }

  @Post('all')
  async getAll(@Body() body: TypeClassFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute(body);
    return ProcessResponse.setResponse(res, ans, TypeclassMappers.AllToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TYPE_CLASS)
  @Post('create')
  async create(@Body() body: TypeclassCreateDto, @Response() res) {

    this._logger.log('Create');

    const local = await this.createTypeClassUseCase.execute(body);
    return ProcessResponse.setResponse<TypeClass>(res, local, TypeclassMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TYPE_CLASS)
  @Put()
  async update(@Body() body: TypeclassUpdateDto, @Response() res) {
    this._logger.log('Update');

    const local = await this.updateTypeClassUseCase.execute(body);
    return ProcessResponse.setResponse<TypeClass>(res, local, TypeclassMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TYPE_CLASS)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const local = await this.removeTypeClassUseCase.execute(body);
    return ProcessResponse.setResponse<TypeClass>(res, local, TypeclassMappers.DomainToDto);
  }


}
