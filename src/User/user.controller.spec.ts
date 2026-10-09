import { UsersController } from './user.controller';

describe('UsersController', () => {
  const makeController = () => {
    const service = {
      getUser: jest.fn().mockResolvedValue({ email: 'a@b.se' }),
      createUser: jest.fn().mockResolvedValue({ email: 'a@b.se' }),
      updateUser: jest.fn().mockResolvedValue({ email: 'a@b.se' }),
      updateWildCard: jest.fn().mockResolvedValue(true),
    };
    return { controller: new UsersController(service as any), service };
  };
  const req = { user: { email: 'a@b.se' } } as any;
  const anonymous = {} as any;

  it('passes the email from the JWT to every service call', async () => {
    const { controller, service } = makeController();
    const dto = { name: 'A' } as any;

    await controller.getUser(req);
    await controller.createUser(req, dto);
    await controller.updateUser(dto, req);
    await controller.updateWildcard(req, 'alice');

    expect(service.getUser).toHaveBeenCalledWith('a@b.se');
    expect(service.createUser).toHaveBeenCalledWith('a@b.se', dto);
    expect(service.updateUser).toHaveBeenCalledWith('a@b.se', dto);
    expect(service.updateWildCard).toHaveBeenCalledWith('alice', 'a@b.se');
  });

  it('rejects requests without an authenticated user', () => {
    const { controller, service } = makeController();
    expect(() => controller.getUser(anonymous)).toThrow('User not found');
    expect(() => controller.createUser(anonymous, {} as any)).toThrow();
    expect(() => controller.updateUser({} as any, anonymous)).toThrow();
    expect(() => controller.updateWildcard(anonymous, 'x')).toThrow();
    expect(service.getUser).not.toHaveBeenCalled();
  });
});
