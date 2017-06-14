import { CategoryRepository } from '../repository/';
import { Entity } from './entity';

export class Category extends Entity<CategoryRepository>{
    public name;
    public children;
    update(){ super.update('category.get'); }
    parse(data: any){ 
        this.name = data.name;
        this.children = data.children;
        this.readiness = true;
    } 
}
