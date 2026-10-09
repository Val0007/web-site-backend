import { GoogleStrategy } from './GoogleStrategy';
import { JwtStrategy } from './JwtStrategy';

const config = {
  get: jest.fn((key: string) => `value-of-${key}`),
  getOrThrow: jest.fn((key: string) => `value-of-${key}`),
} as any;

describe('JwtStrategy', () => {
  it('requires JWT_SECRET and returns the payload as the user', () => {
    const strategy = new JwtStrategy(config);
    expect(config.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    expect(strategy.validate({ email: 'a@b.se' })).toEqual({
      email: 'a@b.se',
    });
  });
});

describe('GoogleStrategy', () => {
  const strategy = new GoogleStrategy({} as any, config);

  it('extracts the first email from the Google profile', () => {
    const done = jest.fn();
    strategy.validate(
      'at',
      'rt',
      { emails: [{ value: 'a@b.se' }] } as any,
      done,
    );
    expect(done).toHaveBeenCalledWith(null, { email: 'a@b.se' });
  });

  it('returns null when the profile has no email', () => {
    const done = jest.fn();
    expect(strategy.validate('at', 'rt', {} as any, done)).toBeNull();
    expect(done).not.toHaveBeenCalled();
  });
});
