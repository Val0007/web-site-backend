import { SiteService } from './site.services';

describe('SiteService', () => {
  it('returns the portfolio when the subdomain exists', async () => {
    const mockUserModel = {
      findOne: jest.fn().mockResolvedValue({ name: 'Alice' }),
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const siteService = new SiteService(mockUserModel as any);

    const portfolio = await siteService.getSite('alice');

    expect(portfolio).toEqual({ name: 'Alice' });
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ wildcard: 'alice' });
  });

  it('throws an error when the subdomain does not exist', async () => {
    const mockUserModel = { findOne: jest.fn().mockResolvedValue(null) };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const siteService = new SiteService(mockUserModel as any);

    await expect(siteService.getSite('unknown')).rejects.toThrow(
      'Site not Found',
    );
  });
});