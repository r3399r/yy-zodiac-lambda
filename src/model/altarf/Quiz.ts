import { GoogleSpreadsheetRow } from 'google-spreadsheet';

export enum QuestionType {
  SINGLE = 'S',
  MULTIPLE = 'M',
  FILL_IN_BLANK = 'B',
}

export enum QuizValidateResponseStatus {
  OK = 'OK',
  NEED_MORE_WORK = 'NEED_MORE_WORK',
}

export type QuizValidate = {
  line: number;
  reason: string;
};

export type QuizValidateResponse = {
  status: QuizValidateResponseStatus;
  content: QuizValidate[];
};

export type QuestionRow = GoogleSpreadsheetRow & {
  question?: string;
  type?: QuestionType;
  options?: string;
  answer?: string;
  image?: string;
  field?: string;
};
