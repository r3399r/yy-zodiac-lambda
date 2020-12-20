import { injectable } from 'inversify';
/**
 * Service class for labmda A.
 */
@injectable()
export class LambdaAService {
  public getText(text: string): string {
    return text;
  }
}
