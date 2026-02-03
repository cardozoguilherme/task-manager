import * as bcrypt from 'bcrypt';

export async function genSalt(): Promise<string> {
  return bcrypt.genSalt();
}

export async function hash(
  data: string,
  saltOrRounds: string | number,
): Promise<string> {
  return bcrypt.hash(data, saltOrRounds);
}

export async function compare(
  data: string,
  encrypted: string,
): Promise<boolean> {
  return bcrypt.compare(data, encrypted);
}
