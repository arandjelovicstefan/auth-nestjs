import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  //class-validator i class-transformer paketi za automatsku validaciju
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
