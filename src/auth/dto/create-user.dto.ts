import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
    @IsString()
    fullName: string;

    @IsString()
    username: string;

    @IsEmail()
    @IsString()
    email: string;

    @MinLength(5)
    @IsString()
    password: string;

    @IsString()
    accountType: string
}