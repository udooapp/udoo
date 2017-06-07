import {Component, OnInit} from '@angular/core';


import {IValidator} from "../validator/validator.interface";
import {PasswordValidator} from "../validator/password.validator";
import {EmptyValidator} from "../validator/empty.validator";
import {NotifierService} from "../services/notify.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AppRoutingModule} from "../app/app.routing.module";
import {EmailValidator} from "../validator/email.validator";
import {EmailService} from "../services/email.service";
import {TokenService} from "../guard/TokenService";

@Component({
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  providers: [EmailService]
})
export class VerificationComponent implements OnInit {
  private static NAME: string = 'Verification';
  message: string = '';
  error = '';
  data: string = '';
  valid: boolean = false;
  validate: boolean = false;
  emailValidator: IValidator = new EmailValidator();
  emptyValidator: IValidator = new EmptyValidator();
  token: string = '';
  verification: boolean = false;
  invalid: boolean = false;

  constructor(private reminderService: EmailService, private notifier: NotifierService, private router: Router, private route: ActivatedRoute, private tokenService: TokenService) {
    notifier.notify(VerificationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == VerificationComponent.NAME) {
        router.navigate([tokenService.getToken() ? AppRoutingModule.CREATE : AppRoutingModule.LOGIN]);
      }
    })
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.token = params['token'];
        if (this.token != null && this.token.length > 0) {
          this.verification = true;
          this.reminderService.checkVerification(this.token).subscribe(
            message =>{
              this.message="Your account is active!";
              this.notifier.refreshMainData();
            },
            error => {
              this.notifier.notifyError(error);
              this.error = error;
              this.message = '';
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
        if (this.token.length === 0) {
          this.reminderService.sendVerification(this.data).subscribe(
            message => {
              this.message = message;
              this.error = '';
            },
            error => {
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
