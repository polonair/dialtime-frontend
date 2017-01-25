import { DataRepository } from './data.repository';

export abstract class Repository{
	public dataRepository: DataRepository;
	constructor(repo: DataRepository){
		this.dataRepository = repo;
	}
    abstract get(args);
    getAll?();
    create?(args);
    getLast?(count);
    getLength?();
    abstract ids(ids: number[]);
}
