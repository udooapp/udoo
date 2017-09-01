import {Component, OnInit} from '@angular/core';


import {NotifierController} from "../../controllers/notify.controller";
import {Router} from "@angular/router";
import {EmailService} from "../../services/email.service";
import {EmptyValidator} from "../../validator/empty.validator";
import {IValidator} from "../../validator/validator.interface";
import {DialogController} from "../../controllers/dialog.controller";
import {UserController} from "../../controllers/user.controller";
import {ROUTES} from "../../app/app.routing";

@Component({
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
  providers: [EmailService]
})
export class ActivationComponent implements OnInit {
  private static NAME: string = 'Activation';

  private activation: number = 0;
  private verificationCode: string = '';
  private empty: boolean = true;

  public message: String;
  public errorMessage: string = '';
  public okMessage: string = '';
  public emptyValidator: IValidator;
  public validate: boolean = false;
  public type: boolean[] = [false, false];
  public loaded: boolean = false;
  public phone: string = '';
  public email: string = '';
  constructor(private userController: UserController, private dialog: DialogController, private notifier: NotifierController, private router: Router, private emailService: EmailService) {
    this.emptyValidator = new EmptyValidator();
  }

  onClickSend(type) {
    if (type == 0) {
      this.emailService.sendVerificationEmail().subscribe(
        () => {
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
          this.userController.refreshUser();
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
        this.router.navigate([ROUTES.MAIN]);
      }
    });
    this.userController.userDataPipe$.subscribe(data => {
      if (this.activation == 0) {
        this.activation = data.user.active;
        this.phone = data.user.phone;
        this.email = data.user.email;
        if (this.activation >= 15) {
          this.router.navigate([ROUTES.MAIN]);
        } else {
          if(!this.type[0]) {
            this.type[0] = ((this.activation >> 1) & 1) != 0;
          }
          if(!this.type[1]) {
            this.type[1] = ((this.activation >> 3) & 1) != 0;
          }
          this.loaded = true;
        }
      }
    });
    if (this.activation == 0) {
      this.userController.refreshUser();
    }
  }
}
