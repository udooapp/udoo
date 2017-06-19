import {Component, OnInit} from '@angular/core';


import {IValidator} from "../../validator/validator.interface";
import {PasswordValidator} from "../../validator/password.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {NotifierController} from "../../controllers/notify.controller";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LOGIN} from "../../app/app.routing.module";
import {EmailValidator} from "../../validator/email.validator";
import {EmailService} from "../../services/email.service";

@Component({
  templateUrl: './reminder.component.html',
  styleUrls: ['../password/password.component.css'],
  providers: [EmailService]
})
export class ReminderComponent implements OnInit {
  private static NAME: string = 'Reminder';
  message: string = '';
  error = '';
  data: string = '';
  valid: boolean = false;
  validate: boolean = false;
  emailValidator: IValidator = new EmailValidator();
  emptyValidator: IValidator = new EmptyValidator();
  token: string = '';
  reminder: boolean = false;
  invalid: boolean = false;

  constructor(private reminderService: EmailService, private notifier: NotifierController, private router: Router, private route: ActivatedRoute) {
    notifier.notify(ReminderComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == ReminderComponent.NAME) {
        router.navigate([LOGIN]);
      }
    })
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.token = params['token'];
        if(this.token != null && this.token.length > 0) {
          this.reminder = true;
          this.emailValidator = new PasswordValidator();
          this.reminderService.checkToken(this.token).subscribe(
            message => this.message = '',
            error => {
              this.notifier.notifyError(error);
              this.error = 'This link is expired!';
              this.invalid = true
            }
          );
        } else {
          this.token = '';
        }
      });
  }


  public send() {
    if (!this.invalid) {
      if (this.valid) {
        if(this.token.length === 0) {
          this.reminderService.sendReminder(this.data).subscribe(
            message => {
              this.message = message + '\nCheck your email address!';
              this.error = '';
            },
            error => {
              this.error = error;
              this.message = '';
            }
          );
        } else {
          this.reminderService.sendNewPassword(this.data, this.token).subscribe(
            message => {
              this.router.navigate([LOGIN]);
              this.error = '';
            },
            error => {
              this.notifier.notifyError(error);
              this.error = error;
              this.message = '';
            }
          );
        }
      } else {
        this.validate = !this.validate;
        this.message = '';
      }
    }
  }
}
