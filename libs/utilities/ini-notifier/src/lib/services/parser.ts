import ini from 'ini';

export type IniObject = Record<string, unknown>;

export function parseIni(text: string): IniObject {
  try {
    return ini.parse(text);
  } catch (err) {
    throw new Error(`Failed to parse INI: ${(err as Error).message}`);
  }
}
