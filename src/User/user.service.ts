import { Model } from 'mongoose';
import { Injectable, Inject, HttpException } from '@nestjs/common';
import { UserDocument } from 'src/schemas/User.schema';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(email: string, createUserDTO: CreateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      createUserDTO,
      { new: true },
    );
    if (!user) throw new HttpException('Error Creating User', 400);
    return user;
  }

  async updateUser(email: string, updateUserDTO: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      updateUserDTO,
      { new: true },
    );
    if (!user) throw new HttpException('User not Found', 400);
    return user;
  }

  async getUser(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('User not Found', 400);
    return user;
  }

  async updateWildCard(wildcard: string, email: string): Promise<boolean> {
    // Check if any user already has this wildcard
    const existingUser = await this.userModel.findOne({ wildcard });

    if (existingUser) {
      // Wildcard is already in use
      return false;
    }

    // Wildcard is available, assign it to the user
    const user = await this.getUser(email); // this throws if user not found

    user.wildcard = wildcard;
    await user.save();

    return true;
  }
}
