import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //importujemo entitet i pravimo repository
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }, // IMPLEMENTACIJA GLOBAL SCOPE INTERCEPTORA
    // interceptor je dostupan u celom app-u ne samo ovde u ovom modulu
  ], // da bi koristili custom interceptor moramo da ga importujemo kao provider
})
export class UsersModule {}
