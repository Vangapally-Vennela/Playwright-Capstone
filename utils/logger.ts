/** Minimal structured logger so step output is consistent and greppable in CI logs. */
const stamp = () => new Date().toISOString();

export const logger = {
  info: (msg: string) => console.log(`[${stamp()}] [INFO ] ${msg}`),
  warn: (msg: string) => console.warn(`[${stamp()}] [WARN ] ${msg}`),
  error: (msg: string) => console.error(`[${stamp()}] [ERROR] ${msg}`),
};
