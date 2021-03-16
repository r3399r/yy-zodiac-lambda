import { injectable } from 'inversify';

/**
 * Service class to return required parameters
 */
@injectable()
export class SsmService {
  public getParameters(name: string): { [key: string]: string } {
    const nameArray: string[] = name.split(',');
    const res: { [key: string]: string } = {};
    for (const val of nameArray) {
      const envVariable = process.env[val];
      if (envVariable !== undefined) res[val] = envVariable;
    }

    return res;
  }
}
