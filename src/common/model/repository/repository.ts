import * as model from '../';

export abstract class Repository{
    constructor(public dataRepository: model.DataRepository){ }
    abstract get(args);
    getAll?();
    create?(args);
    isReady?();
    getLast?(count);
    getLength?();
    abstract ids(ids: number[]);
}
