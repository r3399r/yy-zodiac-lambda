import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { Star } from 'src/model/sadalsuud/Star';
import { StarService } from 'src/services/StarService';
import { errorOutput } from 'src/util/LambdaOutput';
import { stars } from './stars';
import { StarsEvent } from './StarsEvent';

/**
 * Tests of the stars function.
 */
describe('stars', () => {
  let event: StarsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockStarService: any;
  let dummyStar: Star;

  beforeAll(() => {
    dummyStar = {
      name: 'testName',
      birthday: '2020-02-28T20:00:00.000Z',
      hasBook: false,
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockStarService
    mockStarService = {};
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);

    mockStarService.addStar = jest.fn();
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyStar),
    };
    await stars(event, lambdaContext);
    expect(mockStarService.addStar).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
