import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypegooseModule.forFeature([
      User
    ]),
    JwtModule.register({
      secret: "secret"
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
