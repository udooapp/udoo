import {Component, EventEmitter, NgZone, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../../entity/user';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {IValidator} from "../../validator/validator.interface";
import {EmailValidator} from "../../validator/email.validator";
import {PasswordValidator} from "../../validator/password.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {FACEBOOKREGISTRATION, MAP} from "../../app/app.routing.module";
import {DialogController} from "../../controllers/dialog.controller";
import {TokenService} from "../../services/token.service";


declare let FB: any;
declare let gapi: any;
declare let window;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  message: String;
  user = new User(null, '', '', '', '', '', 0, 0, '', 'en', 0, 0);
  error: string;
  googleUser = {};
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  passwordValidator: IValidator = new PasswordValidator();
  valid = [false, false];

  constructor(private router: Router, private userService: UserService, private dialog: DialogController, private tokenService: TokenService) {
  }


  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.router.navigate([MAP]);
    }
    this.facebookInit(document, 'script', 'facebook-jssdk');
    this.initGoogle();

  }

  private checkValidation(): boolean {
    for (let i = 0; i < this.valid.length; ++i) {
      if (!this.valid[i]) {
        return false;
      }
    }
    return true;
  }

  public facebookLogin(): any {
    let t = this;
    FB.login(function (result) {
      if (result.status === 'connected') {

        FB.api('/me', {locale: 'en_US', fields: 'id,name,birthday,email,picture'}, function (response) {
          if (!response.error) {

            t.userService.loginFacebook({
                name: response.name,
                email: response.email,
                birthday: response.birthday,
                id: response.id,
                picture: response.picture.data.url,
                type: false
              }).subscribe(
              value => {
                if (value == null) {
                  t.router.navigate([MAP]);
                } else {
                  localStorage.setItem("registration", JSON.stringify(value));
                  t.router.navigate([FACEBOOKREGISTRATION]);
                }
              },
              error => {
                this.dialog.notifyError(error);
              });
          }
        });
      }
    }, {scope: 'public_profile, email'});
  }

  initGoogle() {
    let t = this;
    gapi.load('auth2', function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      gapi.auth2.init({
        client_id: '372921211759-urde0s3b4l5f0hhq5oi6k6j0cf6vao9k.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        scope: 'email profile'
      });

      gapi.auth2.getAuthInstance().attachClickHandler(document.getElementById('customBtn'), {},
        function (googleUser) {
          let profile = googleUser.getBasicProfile();
          t.userService.loginFacebook({
            name: profile.getName(),
            email: profile.getEmail(),
            id: profile.getId(),
            birthday: undefined,
            picture: profile.getImageUrl(),
            type: true
          }).subscribe(
            value => {
              if (value == null) {
                t.router.navigate([MAP]);
              } else {
                localStorage.setItem("registration", JSON.stringify(value));
                t.router.navigate([FACEBOOKREGISTRATION]);
              }
            },
            error => {
              this.dialog.notifyError(error);
            });
        }, function (error) {
          alert(JSON.stringify(error, undefined, 2));
        });
    });
  };

  facebookInit(d, s, id) {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '179716379231421',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
      });
      FB.AppEvents.logPageView();
    };
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }

  public login() {
    if (this.checkValidation()) {
      this.error = '';
      this.userService.loginUser(this.user)
        .subscribe(
          message =>
            this.router.navigate([MAP]),
          error => {
            this.dialog.notifyError(error);
            this.error = error;
          }
        );
    } else {
      this.error = 'Incorrect or empty value';
    }
  }
}
