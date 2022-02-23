import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UserSerializer } from './user.serializer';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("new")
    async createNewAccount(@Body() body: CreateUserDTO) {
        return plainToClass(UserSerializer, await (await this.authService.createNewUser(body)).toJSON())
    }

    @Post("login")
    async login(@Body() body: LoginDTO) {
        const user = await this.authService.login(body);
        return {
            token: user.token,
            user: plainToClass(UserSerializer, user.user)
        }
    }
}
