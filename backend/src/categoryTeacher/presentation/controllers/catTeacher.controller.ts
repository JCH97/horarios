import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateCatTeacherUseCase,
  FindAllCatTeacherUseCase,
  FindByIdCatTeacherUseCase,
  PaginatedCatTeacherUseCase,
  RemoveCatTeacherUseCase,
  UpdateCatTeacherUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { CatTeacher } from '../../domain/entities/catTeacher.entity';
import { CatTeacherMapper } from '../../infra/mappers/catTeacher.mapper';
import { CatTeacherFindAllDto } from '../../application/dtos/catTeacher.find-all.dto';
import { CatTeacherPaginatedDto } from '../../application/dtos/catTeacher.paginated.dto';
import { CatTeacherCreateDto } from '../../application/dtos/catTeacher.create.dto';
import { CatTeacherUpdateDto } from '../../application/dtos/catTeacher.update.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { PermissionsDecorator } from 'src/auth/application/decorator/permission.decorator';
import { UserPermissions } from 'src/user/domain/enums/user.permissions';

@Controller('category_teacher')
export class CatTeacherController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdCatTeacherUseCase,
    private readonly createCatTeacher: CreateCatTeacherUseCase,
    private readonly updateCatTeacher: UpdateCatTeacherUseCase,
    private readonly removeCatTeacher: RemoveCatTeacherUseCase,
    private readonly paginatedCatTeacher: PaginatedCatTeacherUseCase,
    private readonly findAllCatTeacher: FindAllCatTeacherUseCase) {
    this._logger = new Logger('CatTeacherController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const university = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<CatTeacher>(res, university, CatTeacherMapper.DomainToDto);

  }

  @Post('all')
  async getAll(@Body() body: CatTeacherFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllCatTeacher.execute(body);
    return ProcessResponse.setResponse(res, ans, CatTeacherMapper.PaginatedToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: CatTeacherPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedCatTeacher.execute(body);
    return ProcessResponse.setResponse(res, pag, CatTeacherMapper.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_CAT_TEACHER)
  @Post('create')
  async create(@Body() body: CatTeacherCreateDto, @Response() res) {

    this._logger.log('Create');

    const university = await this.createCatTeacher.execute(body);
    return ProcessResponse.setResponse<CatTeacher>(res, university, CatTeacherMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_CAT_TEACHER)
  @Put()
  async update(@Body() body: CatTeacherUpdateDto, @Response() res) {
    this._logger.log('Update');

    const university = await this.updateCatTeacher.execute(body);
    return ProcessResponse.setResponse<CatTeacher>(res, university, CatTeacherMapper.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_CAT_TEACHER)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const university = await this.removeCatTeacher.execute(body);
    return ProcessResponse.setResponse<CatTeacher>(res, university, CatTeacherMapper.DomainToDto);
  }

}
