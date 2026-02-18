import { HttpCode, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO } from 'src/user-module/dtos/UserDTO';
import { User } from 'src/user-module/schemas/user-schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserServices {

    constructor(
        @InjectModel(User.name) 
        private userModel:Model<User>,
        private jwtService:JwtService
    ){}

    async createUser(userDTO : UserDTO):Promise<Object>{
        userDTO.salt = await bcrypt.genSalt();
        userDTO.password = await bcrypt.hash(userDTO.password!, userDTO.salt);
        const user = new this.userModel(userDTO);
        const savedUser = await user.save();
        return { 
            name: savedUser.name,
            email: savedUser.email
        };
    }

    async login(userDTO:UserDTO):Promise<Object>{
        const user =  await this.userModel.find({
            email:userDTO.email
        }).select("+password +salt");
        const retrievedUser = user[0] as User;
        if(retrievedUser){
            const hashedPassword =  await bcrypt.hash(userDTO.password!, retrievedUser.salt);

            if(hashedPassword == retrievedUser.password){
                const payload = {
                    oi:user[0]._id,
                    email:user[0].email,
                }
                return  {accessToken: await this.jwtService.signAsync(payload)};
            }else{
                throw new HttpException('Invalid user or password',HttpStatus.FORBIDDEN)
            }
        }else{
            throw new HttpException('Invalid user or password',HttpStatus.FORBIDDEN)
        }
        
        
    }

    

    async getUserInfo(tokenPayload:any):Promise<User>{
        const user =  await this.userModel.find({
            _id:tokenPayload.oi,
        });
        if(user.length == 0 ){
            throw new HttpException('User Not Found',HttpStatus.NOT_FOUND)
        }
        return user[0];
    }
}
