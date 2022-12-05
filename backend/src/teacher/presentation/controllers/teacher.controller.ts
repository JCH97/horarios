import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import {
  CreateTeacherUseCase,
  FindAllTeacherUseCase,
  FindByIdTeacherUseCase,
  FindDetailsTeacherUseCase,
  PaginatedTeacherUseCase,
  RemoveTeacherUseCase,
  TeacherBreakUserLinkUseCase,
  UpdateTeacherUseCase,
} from '../../application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Teacher } from '../../domain/entities/teacher.entity';
import { TeacherPaginatedDto } from '../../application/dtos/teacher.paginated.dto';
import { TeacherUpdateDto } from '../../application/dtos/teacher.update.dto';
import { TeacherCreateDto } from '../../application/dtos/teacher.create.dto';
import { TeacherMappers } from '../../infra/mappers/teacher.mappers';
import { TeacherFindAllDto } from '../../application/dtos/teacher.find-all.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';

@Controller('teacher')
export class TeacherController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdTeacherUseCase,
    private readonly createTeacher: CreateTeacherUseCase,
    private readonly updateTeacher: UpdateTeacherUseCase,
    private readonly removeTeacher: RemoveTeacherUseCase,
    private readonly paginatedTeacher: PaginatedTeacherUseCase,
    private readonly findDetailsTeacher: FindDetailsTeacherUseCase,
    private readonly findAllTeachers: FindAllTeacherUseCase,
    private readonly breakUserLink: TeacherBreakUserLinkUseCase) {

    this._logger = new Logger('TeacherController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const teacher = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Teacher>(res, teacher, TeacherMappers.DomainToDto);
  }


  @Post('all')
  async getAll(@Body() body: TeacherFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllTeachers.execute(body);
    return ProcessResponse.setResponse(res, ans, TeacherMappers.AllToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const teacher = await this.findDetailsTeacher.execute({ id: params.id });
    return ProcessResponse.setResponse<Teacher>(res, teacher, TeacherMappers.DomainToDetails);
  }


  @Post()
  async getAllPaginated(@Body() body: TeacherPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedTeacher.execute(body);
    return ProcessResponse.setResponse(res, pag, TeacherMappers.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_USER)
  @Post('unlink_user')
  async unlinkTeacher(@Body() body: { teacherId: string }, @Response() res, @Request() req) {
    this._logger.log('UnLink User');

    const u = await this.breakUserLink.execute(body);

    return ProcessResponse.setResponse(res, u);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TEACHER)
  @Post('create')
  async create(@Body() body: TeacherCreateDto, @Response() res) {

    this._logger.log('Create');

    const teacher = await this.createTeacher.execute(body);
    return ProcessResponse.setResponse<Teacher>(res, teacher, TeacherMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TEACHER)
  @Put()
  async update(@Body() body: TeacherUpdateDto, @Response() res) {
    this._logger.log('Update');

    const teacher = await this.updateTeacher.execute(body);
    return ProcessResponse.setResponse<Teacher>(res, teacher, TeacherMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_TEACHER)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const teacher = await this.removeTeacher.execute(body);
    return ProcessResponse.setResponse<Teacher>(res, teacher, TeacherMappers.DomainToDto);
  }
}
