

import {EventEmitter} from "@angular/core";
export class NotifierService{
    public pageChanged$: EventEmitter<number>;
    constructor(){
      this.pageChanged$ = new EventEmitter();
    }  
    
    public notify(action : number){
      this.pageChanged$.emit(action);
    }
}
