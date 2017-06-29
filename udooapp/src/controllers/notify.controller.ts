import {EventEmitter} from "@angular/core";
import {User} from "../entity/user";

export class NotifierController {
  private pageList: string[] = [];
  public pageChanged$: EventEmitter<string>;
  public userModification$: EventEmitter<number>;
  public userDataPipe$: EventEmitter<User>;

  constructor() {
    this.pageChanged$ = new EventEmitter();
    this.userModification$ = new EventEmitter();
    this.userDataPipe$ = new EventEmitter();
  }
  public sendVerification(){
    this.userModification$.emit(-1);
  }
  public sendUserModification(modification: number){
    this.userModification$.emit(modification)
  }
  public back(): string {
    if (this.pageList.length > 0) {
      let action: string = this.pageList.pop();
      this.pageChanged$.emit(action);
      return action;
    }
    return null;
  }

  public isEmpty(): boolean {

    return this.pageList.length == 0;
  }

  public refreshMainData() {
    this.pageChanged$.emit('refresh');
  }

  public notify(action: string) {
    console.log("Notify: " + action +" " + (this.pageList.length > 0 ?this.pageList[this.pageList.length - 1] : "" ) );
    let pageListLength = this.pageList.length;
    if((pageListLength > 0 && this.pageList[pageListLength - 1] !== action) || pageListLength === 0){
      this.pageList.push(action);
      this.pageChanged$.emit(action + "New");
    }
  }

  public clear() {
    this.pageList = [];
  }
}
