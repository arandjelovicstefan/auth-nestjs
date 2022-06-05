import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session;

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user; // kada smo pronasli usera, stavljamo ga u session jer tome mozemo da pristupimo unutar custom dekoratora
    }

    // ukoliko ne nadjemo user-a, samo da se izvrsi route handler
    return next.handle();
  }
}
