import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { Auth0Module } from 'src/auth0/auth0.module';
import { OrganizationTransformer } from './organization.transformer';
import { UserTransformer } from 'src/user/user.transformer';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationTransformer, UserTransformer],
  imports: [Auth0Module],
})
export class OrganizationModule {}
