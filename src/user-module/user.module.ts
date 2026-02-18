import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserServices } from 'src/user-module/services/user-services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user-module/schemas/user-schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth-guard/auth.guard.service';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AppGuard } from './guard/app-guard/app-guard.service';
@Module({
    imports:[
        MongooseModule.forRoot("mongodb://localhost:27017/users"),
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
    ],
    controllers:[UserController],
    providers:[
        UserServices,
        AuthGuard,
        AppGuard
    ]
})
export class UserModule {}
