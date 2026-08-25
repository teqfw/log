declare global {
  type TeqFw_Log_Console_Writer = import("./src/Console/Writer.mjs").default;
  type TeqFw_Log_Data = Record<string, unknown>;
  type TeqFw_Log_Enum_Level = typeof import("./src/Enum/Level.mjs").default;
  type TeqFw_Log_Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  type TeqFw_Log_Logger = import("./src/Logger.mjs").default;
  type TeqFw_Log_Logger__Class = typeof import("./src/Logger.mjs").default;
  type TeqFw_Log_Provider = import("./src/Provider.mjs").default;
  type TeqFw_Log_Provider__Class = typeof import("./src/Provider.mjs").default;
  type TeqFw_Log_Record = Readonly<{level: TeqFw_Log_Level; message: string; data?: Readonly<TeqFw_Log_Data>; source?: string; time?: Date | string | number}>;
  type TeqFw_Log_Record_Factory = import("./src/Record/Factory.mjs").default;
  type TeqFw_Log_Policy = import("./src/Policy.mjs").default;
  type TeqFw_Log_Policy__Class = typeof import("./src/Policy.mjs").default;
  type TeqFw_Log_Policy_File = import("./src/Policy/File.mjs").default;
  type TeqFw_Log_Policy_Factory = import("./src/Policy/Factory.mjs").default;
  type TeqFw_Log_Node_Fs_ReadFile = (...args: any[]) => Promise<unknown>;
  type TeqFw_Log_Policy_Rule = Readonly<{pattern: string; level: TeqFw_Log_Level; specificity: number}>;
  type TeqFw_Log_Policy_Rules = ReadonlyArray<TeqFw_Log_Policy_Rule>;
  type TeqFw_Log_Writer = Readonly<{write(record: TeqFw_Log_Record): void}>;
}

export type TeqFw_Log_Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type TeqFw_Log_Data = Record<string, unknown>;

export interface TeqFw_Log_Record {
  readonly level: TeqFw_Log_Level;
  readonly message: string;
  readonly data?: Readonly<TeqFw_Log_Data>;
  readonly source?: string;
  readonly time?: Date | string | number;
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

export interface TeqFw_Log_Provider {
  forSource(source: string): TeqFw_Log_Logger;
}

export interface TeqFw_Log_Policy {
  isEnabled(source: string, level: TeqFw_Log_Level): boolean;
  setRules(rules: Record<string, TeqFw_Log_Level>): void;
  applyText(text: string): void;
  setRule(pattern: string, level: TeqFw_Log_Level): void;
  getRules(): Readonly<Record<string, TeqFw_Log_Level>>;
}

export interface TeqFw_Log_Policy_File {
  apply(path: string): Promise<void>;
}

export interface TeqFw_Log_Provider__Class {
  new (dependencies: {
    levels: TeqFw_Log_Enum_Level;
    loggerModule: TeqFw_Log_Logger__Class;
    policy: TeqFw_Log_Policy;
    recordFactory: TeqFw_Log_Record_Factory;
    writer: TeqFw_Log_Writer;
  }): TeqFw_Log_Provider;
}

export {};
