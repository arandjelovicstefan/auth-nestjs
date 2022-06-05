import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private DTO: ClassConstructor) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    // run something before a request is handled by the request handler

    return next.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToInstance(this.DTO, data, {
          excludeExtraneousValues: true,
        });
        //prvi parametar je DTO kakav ce biti vracen user-u, samo property koji su oznaceni sa expose bice vraceni
        //zato je dodat treci parametar da njega nema UserDTO ne bi bio ni uzet u obzir!!!
        //drugi parametar je zapravo ceo user koji vracamo iz baze(koji sadrzi i password)
      }),
    );
  }
}

// custom decorator
export const Serialize = (DTO: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(DTO));
};
