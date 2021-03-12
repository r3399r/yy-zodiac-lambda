import { bindings } from 'src/bindings';
import { SadalsuudEntity } from 'src/model/DbKey';
import { DbSign } from 'src/model/sadalsuud/Sign';
import { DbUser, Role } from 'src/model/sadalsuud/User';
import { DbService } from './DbService';
import { LineService } from './LineService';
import { SignService } from './SignService';
import { UserService } from './UserService';

/**
 * Tests of the SignService class.
 */
describe('SignService', () => {
  let signService: SignService;
  let mockDbService: any;
  let mockUserService: any;
  let mockLineService: any;
  let dummyUser: DbUser;
  let dummySign: DbSign;

  beforeAll(() => {
    dummyUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'testUserId',
      lineUserId: 'testLineId',
      role: Role.FAMILY,
      phone: 'phone',
      stars: [],
    };
    dummySign = {
      projectEntity: SadalsuudEntity.sign,
      creationId: 'testId',
      tripCreationId: 'tripId',
      userCreationId: 'userId',
    };
  });

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    mockLineService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<LineService>(LineService).toConstantValue(mockLineService);

    signService = bindings.get<SignService>(SignService);
  });

  it('addSign should work for first sign', async () => {
    mockUserService.getUser = jest.fn(() => dummyUser);
    mockDbService.query = jest.fn(() => []);
    mockDbService.putItem = jest.fn();

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe('報名成功');
  });

  it('addSign should work for duplicate sign', async () => {
    mockUserService.getUser = jest.fn(() => dummyUser);
    mockDbService.query = jest.fn(() => [dummySign]);

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe('已經報名過囉');
  });

  it('addSign should work for new user', async () => {
    mockUserService.getUser = jest.fn(() => null);
    mockUserService.addEmptySadalsuudUser = jest.fn();
    mockLineService.pushMessage = jest.fn();

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe('請開啟LINE回覆星遊的官方帳號');
    expect(mockUserService.addEmptySadalsuudUser).toBeCalledTimes(1);
    expect(mockLineService.pushMessage).toBeCalledTimes(1);
  });

  it('addSign should work for star-rain member', async () => {
    const starRainMember: DbUser = {
      projectEntity: SadalsuudEntity.user,
      creationId: 'creationId',
      lineUserId: 'testMember',
      role: Role.STAR_RAIN,
      joinSession: 30,
      phone: 'testPhone',
      trips: [],
    };
    mockUserService.getUser = jest.fn(() => starRainMember);

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe(
      '哈囉星雨的哥姐，此活動僅開放給星兒或家長報名。若你想參加活動或你並不是星雨的成員，請洽星遊的LINE官方帳號，謝謝'
    );
  });

  it('addSign should fail with abnormal result', async () => {
    mockUserService.getUser = jest.fn(() => dummyUser);
    mockDbService.query = jest.fn(() => [dummySign, dummySign]);

    await expect(
      signService.addSign({
        tripCreationId: dummySign.tripCreationId,
        lineUserId: dummyUser.lineUserId,
      })
    ).rejects.toThrow(
      'Get multiple signs with same tripCreationId and userCreationId'
    );
  });
});
