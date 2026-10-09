import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto, UpdateUserDto } from './users.dto';

const errorsFor = async (cls: any, body: object) =>
  (await validate(plainToInstance(cls, body))).map((e) => e.property);

const validCreate = {
  name: 'Alice',
  wildcard: 'alice',
  templateId: 1,
  tabs: ['Projects'],
  links: { github: 'https://github.com/alice', linkedin: '' },
  content: {
    Projects: {
      structureId: 2,
      data: [{ title: 'Site', link: 'https://alice.dev' }],
    },
  },
};

describe('CreateUserDto', () => {
  it('accepts a complete portfolio, including empty link strings', async () => {
    await expect(errorsFor(CreateUserDto, validCreate)).resolves.toEqual([]);
  });

  it('rejects missing required fields and empty tab names', async () => {
    const errors = await errorsFor(CreateUserDto, { tabs: [''] });
    expect(errors).toEqual(
      expect.arrayContaining(['name', 'wildcard', 'templateId', 'tabs']),
    );
  });

  it('rejects invalid URLs in links and nested content', async () => {
    const errors = await errorsFor(CreateUserDto, {
      ...validCreate,
      links: { github: 'not a url' },
      content: {
        Projects: { structureId: 2, data: [{ title: 'x', link: 'nope' }] },
      },
    });
    expect(errors).toEqual(expect.arrayContaining(['links', 'content']));
  });
});

describe('UpdateUserDto', () => {
  it('allows partial updates but not empty strings', async () => {
    await expect(errorsFor(UpdateUserDto, { color: 'red' })).resolves.toEqual(
      [],
    );
    await expect(errorsFor(UpdateUserDto, { name: '' })).resolves.toEqual([
      'name',
    ]);
  });
});
