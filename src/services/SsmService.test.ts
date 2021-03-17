import { bindings } from 'src/bindings';
import { SsmService } from 'src/services/SsmService';

/**
 * Tests of the SsmService class.
 */
describe('SsmService', () => {
  let ssmService: SsmService;

  beforeAll(() => {
    process.env = { a: 'aaa', b: 'bbb', c: 'ccc' };
  });

  beforeEach(() => {
    ssmService = bindings.get<SsmService>(SsmService);
  });

  it('getParameters should work', () => {
    expect(ssmService.getParameters('a,b,d')).toStrictEqual({
      a: 'aaa',
      b: 'bbb',
    });
  });
});
