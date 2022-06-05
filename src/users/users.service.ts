import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  //klasicna sintaksa za typeorm repository, uvek je ista i ponavlja se uvek kad god se pravi typeorm repository
  //usersRepository - ime repozitorijuma, kazemo da ce usersRepository da bude instanca od Repository koja ce da sadrzi objekte kao sto je User
  //InjectRepository je obavezan zbog dependency injection jer koristimo genericki tip

  create(email: string, password: string) {
    const createUser = this.usersRepository.create({ email, password }); // sa create pravimo novu instancu entiteta u bazi dok sa save cuvamo
    return this.usersRepository.save(createUser);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.usersRepository.findOne(id);
  }

  find(email?: string) {
    if (!email) return this.usersRepository.find();

    return this.usersRepository.find({ email });
  }

  //Partial je type helper integrisan u TypeScript-u koji ce da napravi da svaki property iz klase User bude opciona !
  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);
    // if (!user) throw new Error('User not found'); NIKAD NE BI TREBALI DA VRACAMO ERROR UNUTAR SERVISA JER NEST.JS NE ZNA KAKO DA HANDLE-UJE TAKAV ERROR
    // ISKLJUCIVO MORA DA SE VRACA EXCEPTION !!

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attributes); //Object assign  update-uje objekat koji smo izvukli iz baze na nove vrednosti iz objekta attributes
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.usersRepository.remove(user);
  }
}

// save koristimo da upisemo tj sacuvamo nesto u bazi... Mozemo direktno da komuniciramo sa bazom sa insert() i update(), koji ce samo sa jednim upitom da izvrse promene
// ali nije dobra praksa, jer necemo da imamo mogucnost koriscenja hook-ova unutar entiteta User, a i save() i remove() su pravljeni tako da primaju entitete
// dok insert() update() i delete() mogu da primaju samo ID ili objekte itd
