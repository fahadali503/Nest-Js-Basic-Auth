import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://localhost:27017/network"),
    AuthModule
  ],
})
export class AppModule { }
