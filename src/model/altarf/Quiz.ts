import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { DbKey } from 'src/model/DbKey';

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

export type Quiz = {
  question?: string;
  type?: QuestionType;
  options?: string;
  answer?: string;
  image?: string;
  field?: string;
};

export type QuizRow = GoogleSpreadsheetRow & Quiz;

export type DbQuiz = DbKey & {
  owner: string;
  label: string;
  questions: Quiz[];
};

export type SaveQuizParams = {
  label?: string;
};
