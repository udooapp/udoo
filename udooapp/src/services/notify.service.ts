import {EventEmitter} from "@angular/core";
export class NotifierService {
  private pageList: string[] = [];
  public pageChanged$: EventEmitter<String>;
  public errorMessage$: EventEmitter<String>;

  constructor() {
    this.pageChanged$ = new EventEmitter();
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
    this.pageList.push(action);
    this.pageChanged$.emit(action + "New");
  }
  public clear(){
    this.pageList = [];
  }
  public notifyError(errorMessage: string) {
    this.errorMessage$.emit(errorMessage);
  }

}
