import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';

@Module({
  imports: [
    //
    TypeOrmModule.forRoot({
      type: 'sqlite', //selektujemo sqlite kao bazu
      database: 'db.sqlite', //ime baze
      entities: [User, Report], //entiteti koji ce ici u bazu
      synchronize: true, //automatska migracija sa bazom prilikom promene entiteta, SAMO U DEV ENV, KASNIJE OBAVEZNO RUCNO PRAVITI MIGRACIJE !!
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
