import {Component} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {DialogController} from "../../controllers/dialog.controller";
@Component({
  selector: 'message-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogWindowComponent{
  error: string = '';
  message: string = '';
  question: string = '';

  constructor(private messages: DialogController) {

    messages.simpleMessage$.subscribe(action => {
        this.message = action;
        this.question = '';
        this.error = ''
    });
    messages.questionMessage$.subscribe(action => {
      this.question = action;
      this.message = '';
      this.error = ''
    });
    messages.errorMessage$.subscribe(action => {
      this.error = action;
      this.question = '';
      this.message = ''
    });
  }

  onClickDialogButton(){
    if (this.message.length > 0) {
      this.message = ''
    } else if(this.question.length > 0){
      this.question = '';
      this.messages.sendQuestionResponse(true);
    } else {
      this.messages.sendErrorResponse(true);
      this.error = '';
    }
  }
  onClickCancel() {
    this.question = '';
    this.messages.sendQuestionResponse(false);
  }
}
