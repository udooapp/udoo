import {Component, EventEmitter, NgZone, OnInit} from '@angular/core';

import 'rxjs/add/operator/switchMap';

import {User} from '../../entity/user';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {IValidator} from "../../validator/validator.interface";
import {EmailValidator} from "../../validator/email.validator";
import {PasswordValidator} from "../../validator/password.validator";
import {EmptyValidator} from "../../validator/empty.validator";
import {SOCIALREGISTRATION, MAP} from "../../app/app.routing.module";
import {DialogController} from "../../controllers/dialog.controller";
import {TokenService} from "../../services/token.service";
import {config} from "../../environments/url.config";
import {Http} from "@angular/http";


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
  emptyValidator: IValidator = new EmptyValidator();
  emailValidator: IValidator = new EmailValidator();
  passwordValidator: IValidator = new PasswordValidator();
  valid = [false, false];
  private accessToken: any;
  googleapi: any;
  constructor(private http: Http, private router: Router, private userService: UserService, private dialog: DialogController, private tokenService: TokenService) {
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
        console.log("RESULT1: " + JSON.stringify(result));
        FB.api('/me', {locale: 'en_US', fields: 'id,name,birthday,email,picture'}, function (response) {
          if (!response.error) {
            console.log("RESULT2: " + JSON.stringify(response));
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
                  t.router.navigate([SOCIALREGISTRATION]);
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
    if (config.client.endsWith('4200')) {
      let t = this;
      gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        gapi.auth2.init({
          client_id: '372921211759-urde0s3b4l5f0hhq5oi6k6j0cf6vao9k.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          scope: 'email profile'
        });

        gapi.auth2.getAuthInstance().attachClickHandler(document.getElementById('gLoginBtn'), {},
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
                  t.router.navigate([SOCIALREGISTRATION]);
                }
              },
              error => {
                this.dialog.notifyError(error);
              });
          }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
          });
      });
    } else {
      let t = this;
      this.googleapi = {
        authorize: function (options) {
          let deferred = {resolve: undefined, reject: undefined};
          //Build the OAuth consent page URL
          let authUrl = 'https://accounts.google.com/o/oauth2/auth?' + 'client_id=' + options.client_id +
              '&redirect_uri=' +  options.redirect_uri +
              '&response_type=code' +
              '&scope=' +  options.scope;

          //Open the OAuth consent page in the InAppBrowser
          let authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

          //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
          //which sets the authorization code in the browser's title. However, we can't
          //access the title of the InAppBrowser.
          //
          //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
          //authorization code will get set in the url. We can access the url in the
          //loadstart and loadstop events. So if we bind the loadstart event, we can
          //find the authorization code and close the InAppBrowser after the user
          //has granted us access to their data.
          authWindow.on('loadstart', function (e) {
            let url = e.originalEvent.url;
            let code = /\?code=(.+)$/.exec(url);
            let error = /\?error=(.+)$/.exec(url);

            if (code || error) {
              //Always close the browser when match is found
              authWindow.close();
            }

            if (code) {
              //Exchange the authorization code for an access token
              t.http.post('https://accounts.google.com/o/oauth2/token', {
                code: code[1],
                client_id: options.client_id,
                client_secret: options.client_secret,
                redirect_uri: options.redirect_uri,
                grant_type: 'authorization_code'
              }).subscribe(data => {
                  deferred.resolve = data;
                  console.log("Google init success: " + JSON.stringify(data));
                  },
              error => {
                  deferred.reject = error.toJson();
                });
            } else if (error) {
              //The user denied access to the app
              deferred.reject ={
                error: error[1]
              };
            }
          });

          return deferred;
        }
      };
    }
  };

  callGoogle() {
    if (!config.client.endsWith('4200')) {
      //  alert('starting');
      this.googleapi.authorize({
        client_id: '372921211759-urde0s3b4l5f0hhq5oi6k6j0cf6vao9k',
        client_secret: 'nGRObsrmvXc4VIsn1ytjJKWX',
        scope: 'email profile',
        redirect_uri: 'http://localhost'
      }).done(function (data) {
        this.accessToken = data.access_token;
        // alert(accessToken);
        // $loginStatus.html('Access Token: ' + data.access_token);
        console.log('data token:' + data.access_token);
        console.log('data: ' + JSON.stringify(data));
        this.getDataProfile();

      });
    }
  }

  getDataProfile() {
    //  alert("getting user data="+accessToken);
    this.http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + this.accessToken).subscribe(
      response => {
        let data = response.json();
        console.log(JSON.stringify(data));
      },
      error => {
        console.log(error)
      }
    );

  }

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
