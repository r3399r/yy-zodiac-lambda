import { bindings } from 'src/bindings';
import { LambdaContext } from 'src/lambda/LambdaContext';
import { LambdaEvent } from 'src/lambda/LambdaEvent';
import { Student } from 'src/model/altarf/User';
import { DbUser } from 'src/model/User';
import { AltarfUserService } from 'src/services/users/AltarfUserService';
import {
  errorOutput,
  LambdaOutput,
  successOutput,
} from 'src/util/LambdaOutput';

export async function student(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const altarfUserService: AltarfUserService = bindings.get<AltarfUserService>(
      AltarfUserService
    );

    let res: DbUser;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body');

        const newStudent: Student = JSON.parse(event.body);
        res = await altarfUserService.addStudent(newStudent);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
