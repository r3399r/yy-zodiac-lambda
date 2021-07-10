import { bindings } from 'src/bindings';
import {
  QuestionType,
  QuizValidateResponse,
  QuizValidateResponseStatus,
} from 'src/model/altarf/Quiz';
import { DbService } from './DbService';
import { GoogleSheetService } from './GoogleSheetService';
import { QuizService } from './QuizService';
import { AltarfUserService } from './users/AltarfUserService';

/**
 * Tests of the QuizService class.
 */
describe('QuizService', () => {
  let quizService: QuizService;
  let mockGooglesheetService: any;
  let mockAltarfUserService: any;
  let mockDbService: any;
  let dummyGoodQuestionRow: unknown[];
  let dummyGoodResult: QuizValidateResponse;
  let dummyBadQuestionRow: unknown[];
  let dummyBadResult: QuizValidateResponse;

  beforeAll(() => {
    dummyGoodQuestionRow = [
      {
        question: 'a',
        type: QuestionType.SINGLE,
        options: '1',
        answer: '1',
        field: 'N',
      },
    ];
    dummyBadQuestionRow = [
      {
        question: 'a',
        type: QuestionType.SINGLE,
        options: '1',
        answer: '1',
        field: 'N',
      },
      {},
      {
        question: 'b',
        type: 'wrong',
        options: 'text',
        answer: 'text',
        field: 'N',
      },
      {
        question: 'c',
        type: QuestionType.SINGLE,
        options: '-1',
        answer: '-1,2',
        field: 'N',
      },
    ];
    dummyGoodResult = {
      status: QuizValidateResponseStatus.OK,
      content: [],
    };
    dummyBadResult = {
      status: QuizValidateResponseStatus.NEED_MORE_WORK,
      content: [],
    };
  });

  beforeEach(() => {
    mockGooglesheetService = { getRows: jest.fn(() => dummyGoodQuestionRow) };
    mockAltarfUserService = { bindSpreadsheetId: jest.fn() };
    mockDbService = { putItem: jest.fn() };

    bindings
      .rebind<GoogleSheetService>(GoogleSheetService)
      .toConstantValue(mockGooglesheetService);
    bindings
      .rebind<AltarfUserService>(AltarfUserService)
      .toConstantValue(mockAltarfUserService);
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    quizService = bindings.get<QuizService>(QuizService);
  });

  it('save should return OK', async () => {
    const res = await quizService.save('lineId', 'sheetId', {});
    expect(res.status).toBe(dummyGoodResult.status);
  });

  it('save should return NEED_MORE_WORK', async () => {
    mockGooglesheetService.getRows = jest.fn(() => dummyBadQuestionRow);
    const res = await quizService.save('lineId', 'sheetId', {});
    expect(res.status).toBe(dummyBadResult.status);
  });
});
