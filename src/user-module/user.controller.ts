import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UserDTO } from 'src/user-module/dtos/UserDTO';
import { UserServices } from 'src/user-module/services/user-services/user.service';
import { AppGuard } from './guard/app-guard/app-guard.service';
import { AuthGuard } from './guard/auth-guard/auth.guard.service';

@UseGuards(AppGuard)
@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(public userServices:UserServices){}

    @Post("register")
    @ApiOperation({ summary: 'Register a new user' })
    @ApiHeader({
        name: 'app-token',
        description: 'Application token for authentication',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                name: { type: 'string', example: 'johndoe' },
                password: { type: 'string', format: 'password', example: 'securePassword123' },
            },
        },
    })
    async createUser(@Body() user:UserDTO, @Res() res){
        try{
            const userDoc = await this.userServices.createUser(user);       
            res.status(HttpStatus.CREATED).send(userDoc);
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            e.message = e.message.includes("email_1 dup key") ? "Email already exists":e.message;
            res.status(e.status).send({errorMessage:e.message});
        }
        
    }

    @Post("login")
    @ApiOperation({ summary: 'User login' })
    @ApiHeader({
        name: 'app-token',
        description: 'Application token for authentication',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', format: 'password', example: 'securePassword123' },
            },
        },
    })
    async login(@Headers() header, @Body() user:UserDTO, @Res() res){
        try{

            const auth = await this.userServices.login(user);
            res.status(HttpStatus.OK).send(auth)
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            res.status(e.status).send({errorMessage:e.message});
        }
        
    }

    @UseGuards(AuthGuard)
    @Get("getInfo")
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiHeader({
        name: 'app-token',
        description: 'Application token for authentication',
        required: true,
    })
    async getInfo(@Req() req:any, @Res() res){
        try{
            const user = await this.userServices.getUserInfo(req.tokenPayload);       
            res.status(HttpStatus.OK).send(user)
        }catch(e){
            e.status = e.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
            res.status(e.status).send({errorMessage:e.message});
        }
        
    }

    
}
