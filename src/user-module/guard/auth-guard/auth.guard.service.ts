import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate  {

    constructor (private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request = context.switchToHttp().getRequest();
        const tokenObject = this.extractHeader(request);

        if(tokenObject == null){
            throw new ForbiddenException();
        }

        try{
            const payload = this.jwtService.verify(tokenObject);
            request["tokenPayload"] = payload;
            return true;
        }catch(e){
            throw new ForbiddenException();
        }


    }

    extractHeader(request:Request){


        const [type , token] = request.headers.authorization?.split(" ") ?? [];

        return type == "Bearer" ? token: null;
    }
}
