/**
 * This module serves as an index of all functions exposed to AWS Lambda. It's
 * also possible to rename them on export here. This module should have no
 * business logic. It should contain only re-exports. For this reason, the
 * 'export-name' rule is disabled for this module.
 */
// tslint:disable: export-name
export { sign } from 'src/lambda/sign/sign';
export { trips } from 'src/lambda/trips/trips';
export { users } from 'src/lambda/users/users';
