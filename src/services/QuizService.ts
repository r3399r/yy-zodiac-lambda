import { inject, injectable } from 'inversify';
import { bindings } from 'src/bindings';
import {
  QuestionRow,
  QuestionType,
  QuizValidate,
  QuizValidateResponse,
  QuizValidateResponseStatus,
} from 'src/model/altarf/Quiz';
import { GoogleSheetService } from 'src/services/GoogleSheetService';
import { AltarfUserService } from 'src/services/users/AltarfUserService';

/**
 * Service class for quiz in google spreadsheet
 */
@injectable()
export class QuizService {
  @inject(AltarfUserService)
  private readonly userService!: AltarfUserService;

  public async validate(
    lineUserId: string,
    sheetId: string
  ): Promise<QuizValidateResponse> {
    await this.userService.bindSpreadsheetId(lineUserId);

    const googleSheetService = bindings.get<GoogleSheetService>(
      GoogleSheetService
    );
    const rows = (await googleSheetService.getRows(sheetId)) as QuestionRow[];

    const badQuestions: QuizValidate[] = [];
    rows.forEach((v: QuestionRow, i: number) => {
      const line = i + 1;
      if (v.question === undefined || v.question === '')
        badQuestions.push({ line, reason: 'empty question' });

      if (v.type === undefined)
        badQuestions.push({ line, reason: 'empty type' });
      else if (!Object.values(QuestionType).includes(v.type))
        badQuestions.push({
          line,
          reason: 'type should be S(single) or M(multiple) or B(fill in blank)',
        });

      if (
        v.options === undefined ||
        (v.type !== QuestionType.FILL_IN_BLANK && v.options === '')
      )
        badQuestions.push({ line, reason: 'empty options' });
      else if (
        v.type !== QuestionType.FILL_IN_BLANK &&
        Number.isNaN(Number(v.options))
      )
        badQuestions.push({
          line,
          reason: 'options should be a number',
        });
      else if (v.type !== QuestionType.FILL_IN_BLANK && Number(v.options) < 1)
        badQuestions.push({
          line,
          reason: 'options should be a position number',
        });

      if (v.answer === undefined || v.answer === '')
        badQuestions.push({ line, reason: 'empty answer' });
      else {
        const ansElement: string[] = v.answer.split(',');
        ansElement.forEach((ans: string) => {
          if (Number.isNaN(Number(ans)))
            badQuestions.push({
              line,
              reason: 'answers should be number',
            });
          else if (Number(ans) < 1)
            badQuestions.push({
              line,
              reason: 'answers should be positive number',
            });
        });
        if (v.type === QuestionType.SINGLE && ansElement.length !== 1)
          badQuestions.push({
            line,
            reason: 'type S should have only 1 answer',
          });
      }

      if (v.field === undefined || v.field === '')
        badQuestions.push({ line, reason: 'empty field' });
    });

    return {
      status:
        badQuestions.length === 0
          ? QuizValidateResponseStatus.OK
          : QuizValidateResponseStatus.NEED_MORE_WORK,
      content: badQuestions,
    };
  }
}
