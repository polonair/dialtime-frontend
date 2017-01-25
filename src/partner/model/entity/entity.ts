import { Repository } from '../repository/repository';

export abstract class Entity<T extends Repository>{
    public id: number;
    protected repo: T;
    protected readiness: boolean = false;

    constructor(repo: T, id: number){
        this.repo = repo;
        this.id = id;
    }
    public update(action: string){
        this.repo.dataRepository.api.doRequest({ action: action, data: this.id}).then((res: any) => {
            if (res.result == "ok") this.parse(res.data);
        }).catch((r) => { this.update(action); });
    }
    public ready(){ return this.readiness; }
    protected abstract parse(data: any);
}
