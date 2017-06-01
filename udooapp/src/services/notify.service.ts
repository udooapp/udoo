

import {EventEmitter} from "@angular/core";
export class NotifierService{
    public pageChanged$: EventEmitter<String>;
    constructor(){
      this.pageChanged$ = new EventEmitter();
    }  
    
    public notify(action : String){
      this.pageChanged$.emit(action);
    }
}
