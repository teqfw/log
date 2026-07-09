export type TeqFw_Log_Level =
  | 'trace'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export interface TeqFw_Log_Data {
  [key: string]: any;
}

export interface TeqFw_Log_Record {
  level: TeqFw_Log_Level;
  message: string;
  data?: TeqFw_Log_Data;
  source?: string;
  time?: Date | string | number;
}

export interface TeqFw_Log_Provider {
  forSource(source: string): TeqFw_Log_Logger;
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
