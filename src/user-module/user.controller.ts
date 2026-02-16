import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { UserDTO } from 'src/user-module/dtos/UserDTO';
import { UserServices } from 'src/user-module/services/user-services/user.service';
import { AuthGuard } from './guard/auth.guard/auth.guard.service';

@Controller('user')
export class UserController {

    constructor(public userServices:UserServices){}

    @Post("register")
    async createUser(@Body() user:UserDTO, @Res() res){
        console.log("user",user);
        try{
            const userDoc = await this.userServices.createUser(user);       
            res.status(HttpStatus.CREATED).send(userDoc);
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            res.status(e.status).send(e.message);
        }
        
    }

    @Post("login")
    async login(@Body() user:UserDTO, @Res() res){
        try{
            console.log()
            const auth = await this.userServices.login(user);       
            res.status(HttpStatus.OK).send(auth)
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            res.status(e.status).send(e.message);
        }
        
    }

    @UseGuards(AuthGuard)
    @Get("getInfo")
    async getInfo(@Req() req:any, @Res() res){
        try{
            const user = await this.userServices.getUserInfo(req.tokenPayload);       
            res.status(HttpStatus.OK).send(user)
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            res.status(e.status).send(e.message);
        }
        
    }

    
}
