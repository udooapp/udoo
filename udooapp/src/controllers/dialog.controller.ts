import {EventEmitter} from "@angular/core";

export class DialogController {
  public questionMessage$: EventEmitter<string>;
  public errorMessage$: EventEmitter<string>;
  public closableMessage$: EventEmitter<any>;
  public simpleMessage$: EventEmitter<string>;
  public questionResponse$: EventEmitter<boolean>;
  public errorResponse$: EventEmitter<boolean>;
  public closableResponse$: EventEmitter<any>;
  public mainRefresh$: EventEmitter<boolean>;

  constructor() {
    this.errorMessage$ = new EventEmitter();
    this.questionMessage$ = new EventEmitter();
    this.simpleMessage$ = new EventEmitter();
    this.questionResponse$ = new EventEmitter();
    this.errorResponse$ = new EventEmitter();
    this.mainRefresh$ = new EventEmitter();
    this.closableMessage$ = new EventEmitter();
    this.closableResponse$ = new EventEmitter();
  }

  public notifyError(errorMessage: string) {
    if (errorMessage === 'Server error' || errorMessage === 'No internet connection' || errorMessage === 'Service Unavailable' || errorMessage === 'Invalid token') {
      this.errorMessage$.emit(errorMessage);
      if (errorMessage === 'Invalid token') {
        this.mainRefresh$.emit(true);
      }
    }
  }

  public sendQuestion(message: string) {
    this.questionMessage$.emit(message);
  }

  public sendMessage(message: string) {
    this.simpleMessage$.emit(message);
  }

  public sendClosable(message: any) {
    if (message.index > -1 && message.content) {
      this.closableMessage$.emit(message);
    }
  }

  public sendQuestionResponse(value: boolean) {
    this.questionResponse$.emit(value);
  }

  public sendErrorResponse(value: boolean) {
    this.errorResponse$.emit(value);
  }

  public sendClosableResponse(index: number, value: boolean) {
    this.closableResponse$.emit({index: index, value: value});
  }

  public sendRefreshRequest() {
    this.mainRefresh$.emit(false);
  }
}
