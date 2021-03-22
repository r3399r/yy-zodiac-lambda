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
      status: 'testStatus',
      name: 'testName',
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
    mockLineService = { pushMessage: jest.fn() };
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
    expect(res).toBe('報名成功，將於截止後進行抽籤');
  });

  it('addSign should work for duplicate sign', async () => {
    mockUserService.getUser = jest.fn(() => dummyUser);
    mockDbService.query = jest.fn(() => [dummySign]);

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe('已經報名成功過囉，將於截止後進行抽籤');
  });

  it('addSign should work for new user', async () => {
    mockUserService.getUser = jest.fn(() => null);

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe(
      '報名尚未成功。資料庫並未有您的資料，請開啟LINE回覆星遊的官方帳號'
    );
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
      name: 'testName2',
      status: 'testStatus',
    };
    mockUserService.getUser = jest.fn(() => starRainMember);

    const res: string = await signService.addSign({
      tripCreationId: dummySign.tripCreationId,
      lineUserId: dummyUser.lineUserId,
    });
    expect(res).toBe(
      '報名失敗。此活動僅開放給星兒或家人報名，資料庫顯示您的身份為「星雨哥姐」。若您想參加活動或資料設定有誤，請洽星遊的LINE官方帳號，謝謝'
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
