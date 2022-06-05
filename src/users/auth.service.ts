import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserDTO } from './user-dtos/update-user.dto';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async generateHashedPassword(password: string) {
    // hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // has the salt and password together, returns random 32 bytes
    const hash = (await scrypt(password, salt, 32)) as Buffer; // da bi se resio problem sa TS,
    //Buffer je zapravo ono sto vraca scrypt ali posto TS to ne zna jer smo scrypt prvo provukli kroz promisify, moramo ovako da ga warp-ujemo

    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    return result;
  }

  async signup(email: string, password: string) {
    // provera da li je email vec zauzet
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email already in use!'); // proveravamo sa users.length zato sto vraca niz, bice ili 1 ili nijedan

    const hashedPassword = await this.generateHashedPassword(password); //vraca Promise<string> zato mora await da se resi promise

    const user = await this.usersService.create(email, hashedPassword);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Wrong password!');

    return user;
  }

  async update(id: number, body: UpdateUserDTO) {
    if (body.password) {
      const hashedPassword = await this.generateHashedPassword(body.password); //vraca Promise<string> zato mora await da se resi promise
      body.password = hashedPassword;
    }
    const user = await this.usersService.update(id, body);
    return user;
  }
}
