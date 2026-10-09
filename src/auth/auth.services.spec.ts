import { AuthService } from './auth.services';

describe('AuthService', () => {
  const makeService = () => {
    const model = { findOne: jest.fn(), create: jest.fn() };
    const jwt = { sign: jest.fn().mockReturnValue('signed-token') };
    const service = new AuthService(model as any, jwt as any);
    return { service, model, jwt };
  };

  it('signs a JWT for an existing user without creating a new one', async () => {
    const { service, model, jwt } = makeService();
    model.findOne.mockResolvedValue({ email: 'a@b.se' });

    await expect(service.signIn({ email: 'a@b.se' })).resolves.toBe(
      'signed-token',
    );
    expect(model.create).not.toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith({ email: 'a@b.se' });
  });

  it('registers a new user with a random 6-char subdomain on first login', async () => {
    const { service, model, jwt } = makeService();
    model.findOne.mockResolvedValue(null);
    model.create.mockImplementation((doc: { email: string }) =>
      Promise.resolve(doc),
    );

    await expect(service.signIn({ email: 'new@b.se' })).resolves.toBe(
      'signed-token',
    );
    const created = model.create.mock.calls[0][0] as {
      email: string;
      wildcard: string;
      templateId: number;
    };
    expect(created.email).toBe('new@b.se');
    expect(created.templateId).toBe(1);
    expect(created.wildcard).toMatch(/^[a-z0-9]{6}$/);
    expect(jwt.sign).toHaveBeenCalledWith({ email: 'new@b.se' });
  });

  it('throws 400 when the database refuses to create the user', async () => {
    const { service, model } = makeService();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    model.create.mockRejectedValue(new Error('duplicate key'));

    await expect(service.registerUser({ email: 'a@b.se' })).rejects.toThrow(
      'not able to create',
    );
  });
});
