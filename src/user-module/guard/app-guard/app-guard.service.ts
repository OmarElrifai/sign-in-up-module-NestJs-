import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigFactory } from '@nestjs/config';

@Injectable()
export class AppGuard  implements CanActivate  {


     async canActivate(context: ExecutionContext): Promise<boolean>  {

         const request = context.switchToHttp().getRequest();
         const retrievedToken = request.headers["app-token"];
         const appToken = process.env.APP_TOKEN;

         if(retrievedToken != appToken){
            throw new ForbiddenException({errorMessage:'You do not have the required permissions.'});
         }else{
            return true;
         }

     }

 }
