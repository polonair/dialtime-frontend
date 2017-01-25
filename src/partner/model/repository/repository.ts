import { DataRepository } from './data.repository';
//import { Entity } from '../entity/entity';

export abstract class Repository{
	public dataRepository: DataRepository;
	constructor(repo: DataRepository){
		this.dataRepository = repo;
	}
    abstract get(args);
    create?(args);
    abstract ids(ids: number[]);
}
