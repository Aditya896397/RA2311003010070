export type LogStack = "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogPackage = 
    | "api" | "component" | "hook" | "page" | "state" | "style" 
    | "auth" | "config" | "middleware" | "utils";

/**
 * Initialize the logger with the bearer token.
 * For frontend applications, call this once at app initialization.
 * @param token - The Authorization token (Bearer)
 */
export function initLogger(token: string): void;

/**
 * Log a message to the evaluation service.
 * @param stack - 'frontend'
 * @param level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param pkg - The package/layer originating the log
 * @param message - The actual log message
 */
export function Log(stack: LogStack, level: LogLevel, pkg: LogPackage, message: string): Promise<void>;
