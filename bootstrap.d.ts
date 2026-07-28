import type {TeqFw_Log_Provider$, TeqFw_Log_Record} from './types.d.ts';

export type {TeqFw_Log_Data, TeqFw_Log_Level, TeqFw_Log_Logger, TeqFw_Log_Provider$, TeqFw_Log_Record} from './types.d.ts';

export interface Writer {
  write(record: TeqFw_Log_Record): void;
  shutdown?(): void;
  close?(): void;
}

export interface BootstrapOptions {
  writers?: readonly Writer[];
}

export interface BootstrapResult {
  readonly provider: TeqFw_Log_Provider$;
  shutdown(): void;
}

export function createBootstrap(options?: BootstrapOptions): Promise<BootstrapResult>;

export default createBootstrap;
