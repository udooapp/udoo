import {Component, OnInit} from '@angular/core';


import {UserService} from "../../services/user.service";
import {NotifierController} from "../../controllers/notify.controller";
import {Router} from "@angular/router";
import {MAP} from "../../app/app.routing.module";
import {EmailService} from "../../services/email.service";
import {EmptyValidator} from "../../validator/empty.validator";
import {IValidator} from "../../validator/validator.interface";
import {DialogController} from "../../controllers/dialog.controller";

@Component({
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
  providers: [EmailService]
})
export class ActivationComponent implements OnInit {
  private static NAME: string = 'Activation';
  message: String;
  errorMessage: string = '';
  okMessage: string = '';
  verificationCode: string = '';
  emptyValidator: IValidator;
  empty: boolean = true;
  validate: boolean = false;
  type: boolean[] = [false, false];
  activation: number = 0;

  constructor(private dialog: DialogController,private notifier: NotifierController, private router: Router, private emailService: EmailService) {
    this.emptyValidator = new EmptyValidator();
  }

  onClickSend(type) {
    if(type == 0){
      this.emailService.sendVerificationEmail().subscribe(
        message => {
          this.dialog.sendMessage("Email sent");
        },
        error => this.errorMessage = error
      );
    } else {
      this.emailService.sendVerificationSms().subscribe(
        message => {
          this.dialog.sendMessage(message);
        },
        error => this.errorMessage = error
      );
    }
  }

  onKey(event) {
    if (this.errorMessage.length > 0) {
      this.errorMessage = '';
    }
    this.verificationCode = event;
  }

  onClickActivate() {
    this.validate = !this.validate;
    this.okMessage = '';
    this.errorMessage = '';
    if (!this.empty) {
      this.emailService.sendKey(this.verificationCode).subscribe(
        message => {
          this.type[1] = true;
          this.okMessage = message;
          this.dialog.sendRefreshRequest();
        },
        error => this.errorMessage = error
      );
    }
  }

  onChangeValidate(event) {
    this.empty = !event;
  }

  ngOnInit(): void {
    this.notifier.notify(ActivationComponent.NAME);
    this.notifier.pageChanged$.subscribe(action => {
      if (action == ActivationComponent.NAME) {
        this.router.navigate([MAP]);
      }
    });
    this.notifier.userDataPipe$.subscribe(user => {

      this.activation = user.active;
      if(this.activation>= 15){
        this.router.navigate([MAP]);
      } else {
        for(let i = 0; i < 2; ++i){
          this.type[i] = ((this.activation >>(i * 2 + 1))&1) != 0;
        }
      }
    });
    this.notifier.userModification$.emit(4);
  }
}
