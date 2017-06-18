import {Component, OnInit} from '@angular/core';


import {IValidator} from "../../validator/validator.interface";
import {EmptyValidator} from "../../validator/empty.validator";
import {NotifierService} from "../../services/notify.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LOGIN, MAP} from "../../app/app.routing.module";
import {EmailValidator} from "../../validator/email.validator";
import {EmailService} from "../../services/email.service";
import {TokenService} from "../../services/token.service";

@Component({
  templateUrl: './verification.component.html',
  styleUrls: ['../password/password.component.css'],
  providers: [EmailService]
})
export class VerificationComponent implements OnInit {
  private static NAME: string = 'Verification';
  message: string = '';
  error = '';

  constructor(private reminderService: EmailService, private notifier: NotifierService, private router: Router, private route: ActivatedRoute, private tokenService: TokenService) {
    notifier.notify(VerificationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == VerificationComponent.NAME) {
        router.navigate([tokenService.getToken() ? MAP : LOGIN]);
      }
    })
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        let token: string = params['token'];
        if (token != null && token.length > 0) {
          this.reminderService.checkVerification(token).subscribe(
            message =>{
              this.message="Your account is active!";
              this.notifier.refreshMainData();
            },
            error => {
              this.notifier.notifyError(error);
              this.error = error;
              this.message = '';
            }
          );
        } else {
          token = '';
        }
      });
  }
}
