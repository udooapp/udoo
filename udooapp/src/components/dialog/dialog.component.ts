import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {DialogController} from "../../controllers/dialog.controller";
@Component({
  selector: 'message-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogWindowComponent{
  public error: string = '';
  public message: string = '';
  public question: string = '';
  public closable: string = '';
  private index: number = -1;

  constructor(private messages: DialogController) {

    messages.simpleMessage$.subscribe(action => {
      this.message = action;
      this.question = '';
      this.closable = '';
      this.error = '';
      this.messages.componentBlur$.emit(true);
    });

    messages.closableMessage$.subscribe(action => {
      this.closable = action.content;
      this.index = action.index;
      this.message = '';
      this.question = '';
      this.error = '';
      this.messages.componentBlur$.emit(true);
    });
    messages.questionMessage$.subscribe(action => {
      this.question = action;
      this.message = '';
      this.error = '';
      this.closable = '';
      this.messages.componentBlur$.emit(true);
    });
    messages.errorMessage$.subscribe(action => {
      this.error = action;
      this.question = '';
      this.message = '';
      this.closable = '';
      this.messages.componentBlur$.emit(true);
    });
  }

  onClickDialogButton(){
    this.messages.componentBlur$.emit(false);
    if (this.message.length > 0) {
      this.message = ''
    } else if(this.question.length > 0){
      this.question = '';
      this.messages.sendQuestionResponse(true);
    } else if(this.error.length > 0) {
      this.messages.sendErrorResponse(true);
      this.error = '';
    } else if(this.closable.length > 0){
      this.closable = '';
      this.messages.sendClosableResponse(this.index, true);
    }
  }
  onClickClose(){
    this.messages.componentBlur$.emit(false);
     if(this.closable.length > 0) {
       this.closable = '';
       this.messages.sendClosableResponse(this.index, false);
     }
  }
  onClickCancel() {
    this.messages.componentBlur$.emit(false);
    this.question = '';
    this.messages.sendQuestionResponse(false);
  }
}
