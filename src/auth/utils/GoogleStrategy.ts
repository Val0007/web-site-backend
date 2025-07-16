import {Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy,VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.services';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
     private readonly authService: AuthService,
  ) {
    super({
      clientID: '655754532361-usa83o5acmsv1ophlth6ljeomtkfik1t.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile,done: VerifyCallback,) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    if(!profile.emails) return null
    const user = {email: profile.emails[0].value}
    done(null, user);
  }
}