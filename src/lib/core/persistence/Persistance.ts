
export abstract class Persistance<T> {
    abstract save(t: T): string;
    abstract load(text: string): T;
}

