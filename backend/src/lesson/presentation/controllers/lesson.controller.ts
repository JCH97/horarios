import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateLessonUseCase, FindAllLessonUseCase,
  FindByIdLessonUseCase, FindDetailsLessonUseCase, PaginatedLessonUseCase, RemoveLessonUseCase,
  UpdateLessonUseCase,
} from '../../../lesson/application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Lesson } from '../../../lesson/domain/entities/lesson.entity';
import { LessonPaginatedDto } from '../../../lesson/application/dtos/lesson.paginated.dto';
import { LessonCreateDto } from '../../../lesson/application/dtos/lesson.create.dto';
import { LessonUpdateDto } from '../../../lesson/application/dtos/lesson.update.dto';
import { LessonMappers } from '../../infra/mappers/lesson.mapper';
import { UniversityFindAllDto } from '../../../university/application/dtos/university.find-all.dto';
import { TeacherMappers } from '../../../teacher/infra/mappers/teacher.mappers';
import { FindAllTeacherUseCase } from '../../../teacher/application/useCases';
import { TeacherFindAllDto } from '../../../teacher/application/dtos/teacher.find-all.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';

@Controller('lesson')
export class LessonController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdLessonUseCase,
    private readonly createLesson: CreateLessonUseCase,
    private readonly updateLesson: UpdateLessonUseCase,
    private readonly removeLesson: RemoveLessonUseCase,
    private readonly paginatedLesson: PaginatedLessonUseCase,
    private readonly findDetailsLesson: FindDetailsLessonUseCase,
    private readonly findAllLessons: FindAllLessonUseCase) {

    this._logger = new Logger('LessonController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const lesson = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Lesson>(res, lesson, LessonMappers.DomainToDto);
  }

  @Post('all')
  async getAll(@Body() body: TeacherFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAllLessons.execute(body);
    return ProcessResponse.setResponse(res, ans, LessonMappers.PaginatedToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const lesson = await this.findDetailsLesson.execute({ id: params.id });
    return ProcessResponse.setResponse<Lesson>(res, lesson, LessonMappers.DomainToDetails);
  }


  @Post()
  async getAllPaginated(@Body() body: LessonPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedLesson.execute(body);
    return ProcessResponse.setResponse(res, pag, LessonMappers.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LESSON)
  @Post('create')
  async create(@Body() body: LessonCreateDto, @Response() res) {

    this._logger.log('Create');

    const lesson = await this.createLesson.execute(body);
    return ProcessResponse.setResponse<Lesson>(res, lesson, LessonMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LESSON)
  @Put()
  async update(@Body() body: LessonUpdateDto, @Response() res) {
    this._logger.log('Update');

    const lesson = await this.updateLesson.execute(body);
    return ProcessResponse.setResponse<Lesson>(res, lesson, LessonMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_LESSON)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const lesson = await this.removeLesson.execute(body);
    return ProcessResponse.setResponse<Lesson>(res, lesson, LessonMappers.DomainToDto);
  }
}
