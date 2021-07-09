import { bindings } from 'src/bindings';
import {
  QuestionType,
  QuizValidateResponse,
  QuizValidateResponseStatus,
} from 'src/model/altarf/Quiz';
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
  let dummyQuestionRow: unknown[];
  let dummyResult: QuizValidateResponse;

  beforeAll(() => {
    dummyQuestionRow = [
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
    dummyResult = {
      status: QuizValidateResponseStatus.NEED_MORE_WORK,
      content: [],
    };
  });

  beforeEach(() => {
    mockGooglesheetService = { getRows: jest.fn(() => dummyQuestionRow) };
    mockAltarfUserService = { bindSpreadsheetId: jest.fn() };

    bindings
      .rebind<GoogleSheetService>(GoogleSheetService)
      .toConstantValue(mockGooglesheetService);
    bindings
      .rebind<AltarfUserService>(AltarfUserService)
      .toConstantValue(mockAltarfUserService);

    quizService = bindings.get<QuizService>(QuizService);
  });

  it('validate should work', async () => {
    const res = await quizService.validate('lineId', 'sheetId');
    expect(res.status).toBe(dummyResult.status);
  });
});
