import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('LoginPage', function() {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('should Sign In  working', () => {
    page.navigateTo(ROUTES.MAIN);
    page.waitingForAngular();
    page.setButtonClick('menu-button');
    page.setButtonClick('login-menu-button');
    page.waitingForAngular();
    page.setText('udooTest@udoo.com', 'email-input');
    page.setText('password', 'password-input');
    page.setButtonClick('login-button');
    page.waitingForAngular();
    page.isPresent('content-container').then(message => expect(message == true)).catch(error => expect(false));
  });
  it('should Log Out working', ()=>{
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('logout-button');
    page.isPresent('tab-pager').then(message => expect(message == true)).catch(error => expect(false));
  })
});
