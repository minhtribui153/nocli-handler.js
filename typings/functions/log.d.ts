export declare type NoCliLogType = 'info' | 'warn' | 'error';
export declare const log: (name: string, type: NoCliLogType, ...args: string[]) => void;
