import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

describe('UserService', () => {
  const makeService = () => {
    const model = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    return { service: new UserService(model as any), model };
  };

  describe('createUser / updateUser', () => {
    it('returns the updated user', async () => {
      const { service, model } = makeService();
      model.findOneAndUpdate.mockResolvedValue({ email: 'a@b.se', name: 'A' });

      await expect(
        service.createUser('a@b.se', { name: 'A' } as CreateUserDto),
      ).resolves.toEqual({ email: 'a@b.se', name: 'A' });
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'a@b.se' },
        { name: 'A' },
        { new: true },
      );
    });

    it('createUser throws 400 when no user matches', async () => {
      const { service, model } = makeService();
      model.findOneAndUpdate.mockResolvedValue(null);
      await expect(
        service.createUser('x@b.se', {} as CreateUserDto),
      ).rejects.toThrow('Error Creating User');
    });

    it('updateUser returns the user, or throws when missing', async () => {
      const { service, model } = makeService();
      model.findOneAndUpdate.mockResolvedValueOnce({ email: 'a@b.se' });
      await expect(
        service.updateUser('a@b.se', {} as UpdateUserDto),
      ).resolves.toEqual({ email: 'a@b.se' });

      model.findOneAndUpdate.mockResolvedValueOnce(null);
      await expect(
        service.updateUser('x@b.se', {} as UpdateUserDto),
      ).rejects.toThrow('User not Found');
    });
  });

  describe('getUser', () => {
    it('returns the user, or throws HttpException 400 when missing', async () => {
      const { service, model } = makeService();
      model.findOne.mockResolvedValueOnce({ email: 'a@b.se' });
      await expect(service.getUser('a@b.se')).resolves.toEqual({
        email: 'a@b.se',
      });

      model.findOne.mockResolvedValueOnce(null);
      const err = await service.getUser('x@b.se').catch((e: unknown) => e);
      expect(err).toBeInstanceOf(HttpException);
      expect((err as HttpException).getStatus()).toBe(400);
    });
  });

  describe('updateWildCard', () => {
    it('returns false and saves nothing when the subdomain is taken', async () => {
      const { service, model } = makeService();
      model.findOne.mockResolvedValueOnce({ email: 'other@b.se' });

      await expect(service.updateWildCard('taken', 'a@b.se')).resolves.toBe(
        false,
      );
      expect(model.findOne).toHaveBeenCalledTimes(1);
    });

    it('assigns a free subdomain and saves the user', async () => {
      const { service, model } = makeService();
      const user = { email: 'a@b.se', wildcard: 'old', save: jest.fn() };
      model.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(user);

      await expect(service.updateWildCard('alice', 'a@b.se')).resolves.toBe(
        true,
      );
      expect(user.wildcard).toBe('alice');
      expect(user.save).toHaveBeenCalled();
    });
  });
});
