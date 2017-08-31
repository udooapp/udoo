import {Component, OnInit} from '@angular/core';


import {NotifierController} from "../../controllers/notify.controller";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EmailService} from "../../services/email.service";
import {TokenService} from "../../services/token.service";
import {DialogController} from "../../controllers/dialog.controller";
import {UserController} from "../../controllers/user.controller";
import {ROUTES} from "../../app/app.routing";

@Component({
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  providers: [EmailService]
})
export class VerificationComponent implements OnInit {
  private static NAME: string = 'Verification';
  message: string = '';
  error = '';

  constructor(private userController: UserController, private reminderService: EmailService, private notifier: NotifierController, private router: Router, private route: ActivatedRoute, private tokenService: TokenService, private dialog: DialogController) {
    notifier.notify(VerificationComponent.NAME);
    notifier.pageChanged$.subscribe(action => {
      if (action == VerificationComponent.NAME) {
        router.navigate([tokenService.getToken() ? ROUTES.MAIN : ROUTES.LOGIN]);
      }
    })
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        let token: string = params['token'];
        if (token != null && token.length > 0) {
          this.reminderService.checkVerification(token).subscribe(
            () =>{
              this.message="Your account has been activated!";
              this.userController.refreshUser();
            },
            error => {
              this.dialog.notifyError(error);
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
