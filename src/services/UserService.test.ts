import { DynamoDB } from 'aws-sdk';
import { Converter, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { bindings } from 'src/bindings';
import { AWSMockUtil } from 'test/AWSMockUtil';
import { UserService } from './UserService';

/**
 * Tests of the UserService class.
 */
describe('UserService', (): void => {
  let userService: UserService;
  const mockDynamoDB: any = {};

  beforeEach((): void => {
    const mockDummyItem: GetItemOutput = {
      Item: Converter.marshall({ key: 'value' }),
    };

    mockDynamoDB.getItem = AWSMockUtil.mockRequest(mockDummyItem);
    bindings.rebind<DynamoDB>(DynamoDB).toConstantValue(mockDynamoDB);

    userService = bindings.get<UserService>(UserService);
  });

  it('getUser should work', async (): Promise<void> => {
    const res: any = await userService.getUser('abc');

    expect(res).toStrictEqual({ key: 'value' });
  });
});
