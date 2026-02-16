import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from 'src/user-module/dtos/UserDTO';
import { User } from 'src/user-module/schemas/user-schema';


@Injectable()
export class UserServices {

    constructor(
        @InjectModel(User.name) 
        private userModel:Model<User>,
        private jwtService:JwtService
    ){}

    async createUser(userDTO : UserDTO):Promise<User>{
        const existingUser = await this.userModel.find({
            email:userDTO.email,
            password:userDTO.password
        });
        if(existingUser.length > 0 ){
            throw new HttpException('User already exists',HttpStatus.CONFLICT)
        }
        const user = new this.userModel(userDTO);
        return user.save();
    }

    async login(userDTO:UserDTO):Promise<Object>{
        const user =  await this.userModel.find({
            email:userDTO.email,
            password:userDTO.password
        });
        if(user.length == 0 ){
            throw new HttpException('Invalid user or password',HttpStatus.FORBIDDEN)
        }
        const payload = {
            oi:user[0]._id,
            email:user[0].email,
        }
        return  {access_token: await this.jwtService.signAsync(payload)};
    }

    async getUserInfo(tokenPayload:any):Promise<User>{
        console.log("tokenPayload ---- >",tokenPayload)
        const user =  await this.userModel.find({
            email:tokenPayload.email,
        });
        if(user.length == 0 ){
            throw new HttpException('User Not Found',HttpStatus.NOT_FOUND)
        }
        return user[0];
    }
}
