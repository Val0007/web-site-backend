import { FlagsService } from './flags.service';

describe('FlagsService', () => {
  const makeService = (found: { template2?: boolean } | null) => {
    const lean = jest.fn().mockResolvedValue(found);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
      updateOne: jest.fn().mockResolvedValue({}),
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return { service: new FlagsService(model as any), model };
  };

  it('returns template2 as stored', async () => {
    const { service } = makeService({ template2: true });
    await expect(service.getFlags()).resolves.toEqual({ template2: true });
  });

  it('defaults template2 to false when no flags document exists', async () => {
    const { service } = makeService(null);
    await expect(service.getFlags()).resolves.toEqual({ template2: false });
  });

  it('defaults template2 to false when the field is missing', async () => {
    const { service } = makeService({});
    await expect(service.getFlags()).resolves.toEqual({ template2: false });
  });

  it('creates the document on init without overwriting existing values', async () => {
    const { service, model } = makeService(null);
    await service.onModuleInit();
    expect(model.updateOne).toHaveBeenCalledWith(
      {},
      { $setOnInsert: { template2: false } },
      { upsert: true },
    );
  });
});
