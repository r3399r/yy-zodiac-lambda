import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { StarPair } from 'src/model/sadalsuud/StarPair';
import { StarService } from 'src/services/StarService';
import { errorOutput } from 'src/util/LambdaOutput';
import { starPair } from './starPair';
import { StarPairEvent } from './StarPairEvent';

/**
 * Tests of the starPair function.
 */
describe('starPair', () => {
  let event: StarPairEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockStarService: any;
  let dummyStarPair: StarPair;

  beforeAll(() => {
    dummyStarPair = {
      starId: 'starId',
      userId: 'userId',
      relationship: 'testR',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mock mockStarService
    mockStarService = { addStarPair: jest.fn() };
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      body: JSON.stringify(dummyStarPair),
    };
    await starPair(event, lambdaContext);
    expect(mockStarService.addStarPair).toBeCalledTimes(1);
  });

  it('POST should fail with null body', async () => {
    event = {
      httpMethod: 'POST',
      body: null,
    };
    await expect(starPair(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      body: null,
    };
    await expect(starPair(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
