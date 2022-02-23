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

    async createNewUser({ email, fullName, password, username }: CreateUserDTO) {
        const isUserExist = await this.UserModel.findOne({ $or: [{ email }, { username }] })
        if (isUserExist) {
            throw new BadRequestException("This email/username is already in use.")
        }
        const hashedPassword = await hash(password, 10)
        const user = new this.UserModel({ email, fullName, password: hashedPassword, username });
        await user.save();
        return user
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
