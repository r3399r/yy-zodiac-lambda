import { injectable } from 'inversify';

/**
 * Service class for me
 */
@injectable()
export class MeService {
  public async getMe(): Promise<unknown> {
    return {
      id: '1d23xxxxx',
      lineUserId: '43rds6xxx',
      name: '王小明',
      enrollmentYear: 109,
      role: 'student',
      quizes: [
        { name: '20210621', id: '13867654', time: 45, status: 'finished' },
        { name: '20210629', id: '838676247', time: 45, status: 'testing' },
        { name: '20210704', id: '43132247', time: 45, status: 'ready' },
      ],
      score: {
        N: { totalScore: 60, totalQuestions: 8 },
        S: { totalScore: 72, totalQuestions: 9 },
        G: { totalScore: 55.33, totalQuestions: 7 },
        A: { totalScore: 41.2, totalQuestions: 5 },
        F: { totalScore: 57, totalQuestions: 6 },
        D: { totalScore: 79, totalQuestions: 10 },
      },
    };
  }
}
