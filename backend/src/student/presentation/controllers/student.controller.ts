import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Response, UseGuards } from '@nestjs/common';
import {
  CreateStudentUseCase,
  FindByIdStudentUseCase,
  FindDetailsStudentUseCase,
  PaginatedStudentUseCase,
  RemoveStudentUseCase,
  UpdateStudentUseCase,
} from '../../../student/application/useCases';
import { ProcessResponse } from '../../../shared/core/utils/processResponse';
import { Student } from '../../../student/domain/entities/student.entity';
import { StudentMappers } from '../../../student/infra/mappers/student.mapper';
import { StudentPaginatedDto } from '../../../student/application/dtos/student.paginated.dto';
import { StudentCreateDto } from '../../../student/application/dtos/student.create.dto';
import { StudentUpdateDto } from '../../../student/application/dtos/student.update.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwtAuthGuard';
import { UserPermissions } from '../../../user/domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';

@Controller('student')
export class StudentController {

  private _logger: Logger;

  constructor(
    private readonly findOneUseCase: FindByIdStudentUseCase,
    private readonly createStudent: CreateStudentUseCase,
    private readonly updateStudent: UpdateStudentUseCase,
    private readonly removeStudent: RemoveStudentUseCase,
    private readonly paginatedStudent: PaginatedStudentUseCase,
    private readonly findDetailsStudent: FindDetailsStudentUseCase) {

    this._logger = new Logger('StudentController');
  }

  @Get(':id')
  async findOne(@Param() params, @Response() res) {
    this._logger.log('Find One');

    const student = await this.findOneUseCase.execute({ id: params.id });
    return ProcessResponse.setResponse<Student>(res, student, StudentMappers.DomainToDto);
  }

  @Get('details/:id')
  async findDetails(@Param() params, @Response() res) {
    this._logger.log('Find One Details');

    const student = await this.findDetailsStudent.execute({ id: params.id });
    return ProcessResponse.setResponse<Student>(res, student, StudentMappers.DomainToDetails);
  }


  @Post()
  async getAllPaginated(@Body() body: StudentPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginatedStudent.execute(body);
    return ProcessResponse.setResponse(res, pag, StudentMappers.PaginatedToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_STUDENT)
  @Post('create')
  async create(@Body() body: StudentCreateDto, @Response() res) {

    this._logger.log('Create');

    const student = await this.createStudent.execute(body);
    return ProcessResponse.setResponse<Student>(res, student, StudentMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_STUDENT)
  @Put()
  async update(@Body() body: StudentUpdateDto, @Response() res) {
    this._logger.log('Update');

    const student = await this.updateStudent.execute(body);
    return ProcessResponse.setResponse<Student>(res, student, StudentMappers.DomainToDto);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_STUDENT)
  @Delete()
  async delete(@Body() body: { id: string }, @Response() res) {
    this._logger.log('Delete');

    const student = await this.removeStudent.execute(body);
    return ProcessResponse.setResponse<Student>(res, student, StudentMappers.DomainToDto);
  }
}
