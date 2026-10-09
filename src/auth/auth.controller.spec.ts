import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const makeController = () => {
    const authService = { signIn: jest.fn().mockResolvedValue('jwt-123') };
    const config = { get: jest.fn().mockReturnValue('https://admin.example') };
    const controller = new AuthController(authService as any, config as any);
    return { controller, authService };
  };

  it('redirects to the admin app with the token after Google login', async () => {
    const { controller, authService } = makeController();
    const res = { redirect: jest.fn() };

    await controller.handleRedirect(
      { user: { email: 'a@b.se' } } as any,
      res as any,
    );

    expect(authService.signIn).toHaveBeenCalledWith({ email: 'a@b.se' });
    expect(res.redirect).toHaveBeenCalledWith(
      'https://admin.example?token=jwt-123',
    );
  });

  it('fails the redirect when Google returned no user', async () => {
    const { controller } = makeController();
    await expect(
      controller.handleRedirect({} as any, { redirect: jest.fn() } as any),
    ).rejects.toThrow('Error logging in');
  });

  it('reports login status and the login placeholder', () => {
    const { controller } = makeController();
    expect(controller.handleLogin()).toEqual({ msg: 'Google Authentication' });
    expect(controller.user({ user: {} } as any)).toEqual({
      msg: 'Authenticated',
    });
    expect(controller.user({} as any)).toEqual({ msg: 'Not Authenticated' });
  });
});
