import {inject, TestBed} from '@angular/core/testing';
import {UserService} from "../../services/user.service";
import {MockBackend} from "@angular/http/testing";
import {HttpModule, XHRBackend} from "@angular/http";
import {User} from "../../entity/user";

describe('UserServiceTest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        UserService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  it('#isLoggedIn should return false after creation', inject([UserService], (service: UserService) => {
    let date: Date = new Date();
    let user: User = new User(0, 'test' + date.toDateString(), 'test' + date.getMilliseconds().toString() + '@email.com', '0654321987','', 'password', 0, 0,'12-12-1992', '', 15, 0);
    service.registrateUser(user).subscribe(
      value=>{expect(true)},
      error =>{expect(false)}
    )

  }));
});
