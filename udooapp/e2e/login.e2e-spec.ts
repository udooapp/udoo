import {InputPage} from './input.po';
import {LOGIN, MAIN} from "../src/app/app.routing.module";

describe('LoginPage', function() {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('should Sign In  working', () => {
    page.navigateTo(LOGIN);
    page.setText('udooTest@udoo.com', 'email-input');
    page.setText('password', 'password-input');
    page.setButtonClick('login-button');
    page.isPresent('content-container').then(message => expect(message == true)).catch(error => expect(false));
  });
  it('should Log Out working', ()=>{
    page.navigateTo(MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('logout-button');
    page.isPresent('tab-pager').then(message => expect(message == true)).catch(error => expect(false));
  })
});
