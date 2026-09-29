import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/User.schema';
import { UserDetails } from './utils/UserDetails';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  //   async validateUser(details: UserDetails) {
  //     console.log('AuthService');
  //     console.log(details);
  //     const user = await this.userModel.findOne({ email: details.email });
  //     console.log(user);
  //     if (user) return user;
  //     console.log('User not found. Creating...');
  //     // const newUser = await this.userModel.create(details);
  //     // return newUser
  //     const newuser = {email:details.email}
  //     return newuser
  //   }

  generateJwt(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload);
  }

  async signIn(user: UserDetails) {
    const userExists = await this.userModel.findOne({ email: user.email });
    if (!userExists) {
      return this.registerUser(user);
    }
    const token = this.generateJwt({
      email: userExists.email,
    });
    return token;
  }

  async registerUser(user: UserDetails) {
    try {
      const newUser = await this.userModel.create({
        email: user.email,
        wildcard: this.makeid(6),
        templateId: 1,
      });
      return this.generateJwt({
        email: newUser.email,
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('not able to create', 400);
    }
  }

  private makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
