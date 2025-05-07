export type AnyFn<T = unknown> = (...args: unknown[]) => T

export type AnyObj<T = unknown> = { [key: string]: T }

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
