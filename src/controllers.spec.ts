import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlagsController } from './flags/flags.controller';
import { SiteController } from './site/site.controller';

describe('thin controllers', () => {
  it('AppController returns the health message', () => {
    expect(new AppController(new AppService()).getHello()).toBe('Hello World!');
  });

  it('FlagsController delegates to FlagsService', async () => {
    const flags = {
      getFlags: jest.fn().mockResolvedValue({ template2: true }),
    };
    await expect(new FlagsController(flags as any).getFlags()).resolves.toEqual(
      {
        template2: true,
      },
    );
  });

  it('SiteController looks up the site by subdomain', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const site = { getSite: jest.fn().mockResolvedValue({ name: 'Alice' }) };
    await expect(
      new SiteController(site as any).getUser('alice'),
    ).resolves.toEqual({
      name: 'Alice',
    });
    expect(site.getSite).toHaveBeenCalledWith('alice');
  });
});
