import { Exclude, Expose } from "class-transformer";

export class UserSerializer {

    @Expose()
    email: string;
    @Expose()
    fullName: string;
    @Exclude()
    password: string;

    @Expose()
    username: string;
}