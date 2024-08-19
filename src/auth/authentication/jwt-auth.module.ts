import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStratergy } from './jwt-auth.strategy';
import { PermissionsGuard } from '../authorization/permissions.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStratergy, PermissionsGuard],
  exports: [PassportModule, PermissionsGuard],
})
export class JwtAuthModule {}
