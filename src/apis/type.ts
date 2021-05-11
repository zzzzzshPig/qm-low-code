
export type BaseResZsh<T> = Promise<{
    error: number;
    data: T;
}>
