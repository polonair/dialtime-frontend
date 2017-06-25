import * as model from '../';
import { Repository } from './repository';

export class TaskRepository extends Repository{
    private tasks_by_id = {};
    private tasks = [];
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_task_' + id;
                if (_id in this.tasks_by_id) result.push(this.tasks_by_id[_id]);
                else result.push(null);
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_task_' + id;
            if (_id in this.tasks_by_id) (<model.Task>this.tasks_by_id[_id]).update();
            else {
                let task = new model.Task(this, id);
                this.tasks_by_id[_id] = task;
                this.tasks.push(task);
                task.update();
            }
        }
    }
}
