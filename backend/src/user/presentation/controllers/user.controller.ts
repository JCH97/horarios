import { Body, Controller, Get, Logger, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/application/guards/jwtAuthGuard';
import { ProcessResponse } from 'src/shared/core/utils/processResponse';
import { UserCreateDto } from '../../application/dtos/user.create.dto';
import { UserUpdateDto } from '../../application/dtos/user.update.dto';
import { CreateUserUseCase } from '../../application/useCases/user.create.use-case';
import { UpdateUserUseCase } from '../../application/useCases/user.update.use-case';
import { UserMapper } from '../../infra/mappers/user.mappers';
import { PaginatedUserUseCase } from '../../application/useCases/user.paginate.use-case';
import { UserPaginatedDto } from '../../application/dtos/user.paginated.dto';
import { Result } from '../../../shared/core/Result';
import { right } from '../../../shared/core/Either';
import { UserPermissions } from '../../domain/enums/user.permissions';
import { PermissionsDecorator } from '../../../auth/application/decorator/permission.decorator';
import { UserSetAsTeacherDto } from '../../application/dtos/user.set-as-teacher.dto';
import { SetUserAsTeacherUseCase } from '../../application/useCases/user.set-as-teacher.use-case';
import { TeacherFindAllDto } from '../../../teacher/application/dtos/teacher.find-all.dto';
import { FindAllUserUseCase } from '../../application/useCases/user.get-all.use-case';

@Controller('user')
export class UserController {

  private _logger: Logger;

  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly paginateUser: PaginatedUserUseCase,
    private readonly linkUser: SetUserAsTeacherUseCase,
    private readonly findAll: FindAllUserUseCase) {
    this._logger = new Logger('UserController');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    this._logger.log('Get profile');

    return ProcessResponse.setResponse(res, right(Result.Ok(req.user)));
  }


  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_USER)
  @Post('create')
  async create(@Body() userCreateDto: UserCreateDto, @Response() res) {
    this._logger.log('Create user');

    const user = await this.createUser.execute(userCreateDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }


  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_USER)
  @Put()
  async update(@Body() updateUserDto: UserUpdateDto, @Response() res) {
    this._logger.log('Update user');

    const user = await this.updateUser.execute(updateUserDto);
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }

  @Post()
  async getAllPaginated(@Body() body: UserPaginatedDto, @Response() res) {
    this._logger.log('Paginated');

    const pag = await this.paginateUser.execute(body);
    return ProcessResponse.setResponse(res, pag, (a) => a);
  }

  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.HANDLE_USER)
  @Post('link_teacher')
  async setUserAsTeacher(@Body() body: UserSetAsTeacherDto, @Response() res) {
    this._logger.log('Link teacher');

    const u = await this.linkUser.execute(body);

    return ProcessResponse.setResponse(res, u);
  }

  @Post('all')
  async getAll(@Body() body: TeacherFindAllDto, @Response() res) {
    this._logger.log('Get All');

    const ans = await this.findAll.execute(body);
    return ProcessResponse.setResponse(res, ans, UserMapper.AllToDto);
  }
}