import { Controller, Get, HttpException, HttpStatus, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from 'src/auth0/auth0.token.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile/2')
export class ApiController {
  constructor(
    private readonly tokenService : TokenService
  ){}

  @Get()
  getProfile(@Req() req: any) {
    if (!req.user || !req.user.permissions) {
      throw new HttpException('User permissions not found', HttpStatus.UNAUTHORIZED);
    }

    const permissions: string[] = req.user.permissions;
    if (permissions.find((perm) => perm === 'create:organization')) {
      return this.tokenService.getToken();
    } else {
      Logger.log(permissions);
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
  }
}
