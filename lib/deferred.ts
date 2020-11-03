export default class Deferred<T = unknown>{
    private _promise: Promise<T>;
    _resolve!: (value?: T | PromiseLike<T>) => void;
    _reject!: (reason?: any) => void;
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    get resolve() {
        return this._resolve;
    }
    get reject() {
        return this._reject;
    }
    get promise() {
        return this._promise;
    }
}