import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

//npm run test:watch => pattern => auth.service.spec

describe('AuthService', () => {
  let service: AuthService; //definisemo servis
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // do something before every test

    // create fake copy of usersService

    fakeUsersService = {
      find: () => Promise.resolve([]), // potrebno nam je da uvek vrati prazan niz, da ne bi uleteli u exception
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      update: (id: number, attributes: Partial<User>) => {
        const user = { id: 1, email: 'email@email.com', password: 'password' };
        Object.assign(user, attributes);
        return Promise.resolve({
          id,
          email: user.email,
          password: user.password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // single TEST
    expect(service).toBeDefined();
  });

  it('create new user with salted and hashed password', async () => {
    const user = await service.signup('afsdfsd@gmail.com', 'fsd');

    expect(user.password).not.toEqual('fsd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if user signs up with email that is in use', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    try {
      await service.signup('afsdfsd@gmail.com', 'fsd');
    } catch (err) {
      // done();
    }
  });
});
