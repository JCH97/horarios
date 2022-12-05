import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/shared/modules/config/service/app-config-service';
import { FindByEmailUserUseCase } from 'src/user/application/useCases/user.findByEmail.use-case';
import { UserStatus } from 'src/user/domain/enums/user.status';
import { UserMapper } from '../../../user/infra/mappers/user.mappers';
import { UserDto } from '../../../user/application/dtos/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly findByEmailUseCase: FindByEmailUserUseCase,
    configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.app.jwtSecret,
    });
  }

  async validate(payload: any): Promise<UserDto> {
    try {
      const userDomainOrError = await this.findByEmailUseCase.execute({ email: payload.email });

      if (userDomainOrError.isLeft()) {
        throw new UnauthorizedException('error');
      }

      const userDomain = userDomainOrError.value.unwrap();
      if (!userDomain || userDomain.status == UserStatus.Pending) {
        throw new UnauthorizedException('Error getting user or user is already pending to check email');
      }

      return UserMapper.DomainToDto(userDomain);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}