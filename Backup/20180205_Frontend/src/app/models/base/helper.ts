export class StringObject {
    public value = '';
}

export class Wrapper <T> {
    public value: T;
    constructor(value: T) {
        this.value = value;
    }
}

export class Pair<T1, T2> {
    constructor(first: T1, second: T2) {
        this.first = first;
        this.second = second;
    }
    first: T1;
    second: T2;
}