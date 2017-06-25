import * as model from '../';
import { Repository } from './repository';

export class ScheduleRepository extends Repository{
    private schedules_by_id = {};
    private schedules = [];
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_schedule_' + id;
                if (_id in this.schedules_by_id) result.push(this.schedules_by_id[_id]);
                else result.push(null);
            }
            return result;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_schedule_' + id;
            if (_id in this.schedules_by_id) (<model.Schedule>this.schedules_by_id[_id]).update();
            else {
                let schedule = new model.Schedule(this, id);
                this.schedules_by_id[_id] = schedule;
                this.schedules.push(schedule);
                schedule.update();
            }
        }
    }
}
