import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import { compare, hash } from 'bcrypt';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { JWTPayload } from './jwt.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: ReturnModelType<typeof User>,
        private jwtService: JwtService
    ) { }

    async createNewUser({ email, fullName, password, username, accountType }: CreateUserDTO) {
        const isEmailExist = await this.UserModel.findOne({ email })
        const isUsernameExist = await this.UserModel.findOne({ username })
        if (isEmailExist) {
            throw new BadRequestException("This email is already in use.")
        }

        if (isUsernameExist) {
            throw new BadRequestException("Username is already taken.")
        }
        const hashedPassword = await hash(password, 10)
        const user = new this.UserModel({ email, fullName, password: hashedPassword, username, accountType });
        await user.save();
        return {
            message: "Your account has been created Successfully!"
        }
    }

    async login({ email, password }: LoginDTO) {
        const user = await this.UserModel.findOne({ email });
        if (!user) {
            throw new NotFoundException("Couldn't find the user with this email.")
        }
        const comparedPassword = await compare(password, user.password);
        if (!comparedPassword) {
            throw new NotFoundException("Invalid Email/Password")
        }

        const payload: JWTPayload = { email: user.email, id: user._id };
        const token = this.jwtService.sign(payload)
        return {
            token,
            user: user.toJSON()
        }
    }
}
