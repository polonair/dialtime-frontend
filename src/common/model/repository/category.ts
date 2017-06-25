import * as model from '../';
import { Repository } from './repository';

export class CategoryRepository extends Repository{
    private categories_by_id = {};
    private categories = [];
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_category_' + id;
                if (_id in this.categories_by_id) result.push(this.categories_by_id[_id]);
                else{
                    let category = new model.Category(this, id);
                    this.categories_by_id[_id] = category;
                    this.categories.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}