import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkServer(): string {
    return 'up and running on port';
  }
}
