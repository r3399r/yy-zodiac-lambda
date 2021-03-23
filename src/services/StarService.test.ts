import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbStar, Star } from 'src/model/sadalsuud/Star';
import { StarPair } from 'src/model/sadalsuud/StarPair';
import { Validator } from 'src/Validator';
import { DbService } from './DbService';
import { StarService } from './StarService';

/**
 * Tests of the StarService class.
 */
describe('StarService', () => {
  let starService: StarService;
  let mockDbService: any;
  let mockValidator: any;
  let dummyStar: Star;
  let dummyDbStar: DbStar;
  let dummyStarPair: StarPair;

  beforeAll(() => {
    dummyStar = {
      name: 'testName',
      birthday: '2020-02-28T20:00:00.000Z',
      hasBook: false,
    };
    dummyDbStar = {
      projectEntity: SadalsuudEntity.star,
      creationId: 'id',
      ...dummyStar,
    };
    dummyStarPair = {
      starId: 'starId',
      userId: 'userId',
      relationship: 'testR',
    };
  });

  beforeEach(() => {
    mockDbService = { putItem: jest.fn(), getItem: jest.fn(() => dummyDbStar) };
    mockValidator = { validateStar: jest.fn(), validateStarPair: jest.fn() };

    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<Validator>(Validator).toConstantValue(mockValidator);

    starService = bindings.get<StarService>(StarService);
  });

  it('addStar should work', async () => {
    await starService.addStar(dummyStar);
    expect(mockDbService.putItem).toHaveBeenCalledTimes(1);
  });

  it('getStar should work', async () => {
    expect(await starService.getStar('abc')).toStrictEqual(dummyDbStar);
  });

  it('addStarPair should work', async () => {
    await starService.addStarPair(dummyStarPair);
    expect(mockDbService.putItem).toHaveBeenCalledTimes(1);
  });
});
