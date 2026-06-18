export const logger = {
  info(message: string, meta?: unknown) {
    console.info(`[BlueprintDemo] ${message}`, meta || '');
  },

  warn(message: string, meta?: unknown) {
    console.warn(`[BlueprintDemo] ${message}`, meta || '');
  },

  error(message: string, error?: unknown) {
    console.error(`[BlueprintDemo] ${message}`, error || '');
  }
};
