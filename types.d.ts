export type TeqFw_Log_Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type TeqFw_Log_Data = Record<string, unknown>;

export interface TeqFw_Log_Record {
  readonly level: TeqFw_Log_Level;
  readonly message: string;
  readonly data?: Readonly<TeqFw_Log_Data>;
  readonly source?: string;
  readonly time: Date | string | number;
}

export interface TeqFw_Log_Logger {
  isEnabled(level: TeqFw_Log_Level): boolean;
  write(record: TeqFw_Log_Record): void;
  log(level: TeqFw_Log_Level, message: string, data?: TeqFw_Log_Data): void;
  trace(message: string, data?: TeqFw_Log_Data): void;
  debug(message: string, data?: TeqFw_Log_Data): void;
  info(message: string, data?: TeqFw_Log_Data): void;
  warn(message: string, data?: TeqFw_Log_Data): void;
  error(message: string, data?: TeqFw_Log_Data): void;
  fatal(message: string, data?: TeqFw_Log_Data): void;
}

export interface TeqFw_Log_Provider$ {
  forSource(source: string): TeqFw_Log_Logger;
}

/**
 * DI component constructor. A host application configures it in its Container.
 */
export interface TeqFw_Log_Provider {
  new (dependencies: unknown): TeqFw_Log_Provider$;
}

declare const Provider: TeqFw_Log_Provider;

export default Provider;

declare global {
  type TeqFw_Log_Enum_Level = Readonly<{
    TRACE: 'trace'; DEBUG: 'debug'; INFO: 'info'; WARN: 'warn'; ERROR: 'error'; FATAL: 'fatal';
  }>;
  type TeqFw_Log_Provider$ = import('./types.d.ts').TeqFw_Log_Provider$;
  type TeqFw_Log_Logger$ = import('./types.d.ts').TeqFw_Log_Logger;
  type TeqFw_Log_Record_Factory$ = Readonly<{create(record: Omit<TeqFw_Log_Record, 'time'> & {time?: Date | string | number}): TeqFw_Log_Record}>;
  type TeqFw_Log_Console_Writer$ = Readonly<{write(record: TeqFw_Log_Record): void}>;
  type TeqFw_Log_Writer$ = Readonly<{write(record: TeqFw_Log_Record): void}>;
}
