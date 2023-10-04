import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.lwa_app_id)
    console.log("shaown")
    return 'Hello World!';
  }
}
