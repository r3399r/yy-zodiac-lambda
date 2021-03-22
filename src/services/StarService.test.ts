import { bindings } from 'src/bindings';
import { Star } from 'src/model/sadalsuud/Star';
import { DbService } from './DbService';
import { StarService } from './StarService';

/**
 * Tests of the StarService class.
 */
describe('StarService', () => {
  let starService: StarService;
  let mockDbService: any;
  let inputStar: Star;

  beforeAll(() => {
    inputStar = {
      name: 'testName',
      birthday: '2020-02-28T20:00:00.000Z',
      hasBook: false,
    };
  });

  beforeEach(() => {
    mockDbService = { putItem: jest.fn() };
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    starService = bindings.get<StarService>(StarService);
  });

  it('addStar should work', async () => {
    await starService.addStar(inputStar);
    expect(mockDbService.putItem).toHaveBeenCalledTimes(1);
  });
});
