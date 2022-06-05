import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CreateUserDTO } from './user-dtos/create-user.dto';
import { UpdateUserDTO } from './user-dtos/update-user.dto';
import { UserDTO } from './user-dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDTO) // importujemo custom dekorator koji poziva custom interceptor na celom kontroleru
// ukoliko ne bi koristili interceptor globalno
// @UseInterceptors(CurrentUserInterceptor) //useInterceptors je integrisan dekorator preko kog mozemo da pozivamo custom interceptore
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

  // @Get('currentuser')
  // async currentUser(@Session() session: any) {
  //   const user = await this.usersService.findOne(session.userId);
  //   console.log(user);
  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  // implementacija custom dekoratora
  @Get('currentuser')
  @UseGuards(AuthGuard) // implementacija guarda na jednu rutu, vratice usera iskljucivo ako smo ulogovani ukoliko nismo vratice 403 forbidden
  async currentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    //koristimo Body dekorator da kazemo nestjs-u da zelimo da extract-ujemo body iz request-a
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id; // nece da vrati cookie ukoliko nije update-ovan
    return user;
  }

  //@UseInterceptors(ClassSerializerInterceptor) // kazemo da prilikom get requesta koristi interceptore i prosledjujemo mu koje
  // @Serialize(UserDTO)
  @Get('/:id')
  //kada se parsuje bilo koji deo iz url-a, iako je broj iz url-a uvek dolazi kao string !!
  async findUser(@Param('id') id: 'string') {
    // console.log('Handler is running');
    //parseInt konvertuje string u integer
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  //koristimo query dekorator jer ocekujemo da se getuju useri sa query parametrom
  //npr: auth?email=asd@gmail.com
  // @Serialize(UserDTO)
  @Get()
  findAllUsers(@Query('email') email?: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    const user = await this.authService.update(parseInt(id), body);

    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
