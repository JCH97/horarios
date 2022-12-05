import { Body, Controller, Logger, Param, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ProcessResponse } from 'src/shared/core/utils/processResponse';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LocalAuthGuard } from '../../application/guards/localAuthGuard';
import { LoginUseCase } from '../../application/useCase/auth.login.use-case';
import { RegisterUseCase } from '../../application/useCase/auth.register.use-case';
import { UserMapper } from '../../../user/infra/mappers/user.mappers';
import { ConfirmRegisterUseCase } from '../../application/useCase/auth.confirm.register.use-case';
import { Response as Res } from 'express';

@Controller('auth')
export class AuthController {

  private _logger: Logger;

  constructor(private readonly authRegister: RegisterUseCase,
              private readonly authLogin: LoginUseCase,
              private readonly confirmRegister: ConfirmRegisterUseCase) {
    this._logger = new Logger('Auth Controller');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Login(@Request() req, @Response() res: Res) {
    this._logger.log('Login');

    const login = await this.authLogin.execute(req.user);
    return ProcessResponse.setResponse(res, login, (a) => a);
  }

  @Post('register')
  async Register(@Body() userDto: RegisterDto, @Response() res) {
    this._logger.log('Register');

    const user = await this.authRegister.execute(userDto);
    return ProcessResponse.setResponse(res, user, (a) => a);
  }

  @Post('confirm-register/:token')
  async ConfirmRegister(@Param('token') token: string, @Response() res) {
    this._logger.log('Confirm Register');

    const user = await this.confirmRegister.execute({ token: token });
    return ProcessResponse.setResponse(res, user, UserMapper.DomainToDto);
  }
}