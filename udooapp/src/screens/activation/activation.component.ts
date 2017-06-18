import {Component, OnInit} from '@angular/core';


import {UserService} from "../../services/user.service";
import {NotifierService} from "../../services/notify.service";
import {Router} from "@angular/router";
import {MAP} from "../../app/app.routing.module";
import {EmailService} from "../../services/email.service";
import {EmptyValidator} from "../../validator/empty.validator";
import {IValidator} from "../../validator/validator.interface";

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

  constructor(private notifier: NotifierService, private router: Router, private emailService: EmailService) {
    notifier.notify(ActivationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == ActivationComponent.NAME) {
        router.navigate([MAP]);
      }
    });
    notifier.userDataPipe$.subscribe(user => {
      this.activation = user.active;
      if(this.activation>= 15){
        this.router.navigate([MAP]);
      } else {
        for(let i = 0; i < 2; ++i){
            this.type[i] = ((this.activation >>(i * 2 + 1))&1) != 0;
        }
      }
    });
    notifier.sendUserModification(4);
    this.emptyValidator = new EmptyValidator();
  }

  onClickSend(type) {
    if(type == 0){
      this.emailService.sendVerificationEmail().subscribe(
        message => {
          this.notifier.sendMessage("Email sent");
        },
        error => this.errorMessage = error
      );
    } else {
      this.emailService.sendVerificationSms().subscribe(
        message => {
          this.notifier.sendMessage("SMS sent");
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
          this.type[0] = true;
          this.okMessage = message;
        },
        error => this.errorMessage = error
      );
    }
  }

  onChangeValidate(event) {
    this.empty = !event;
  }

  ngOnInit(): void {
  }
}
