import { randomBytes } from 'crypto';

export function generateEmailConfirmationToken(): string {
  return randomBytes(32).toString('hex');
}