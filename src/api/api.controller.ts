import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from 'src/auth0/auth0.token.service';

@UseGuards(AuthGuard('jwt'))
@Controller('profile/2')
export class ApiController {
  constructor(
    private readonly tokenService : TokenService
  ){}
  getProfile(@Req() req : any){
    const permission : string[] = req.user.permission;
    if(permission.find((permission) => permission == 'create-organization')) {
      return this.tokenService.getToken();
    }
  }
}
