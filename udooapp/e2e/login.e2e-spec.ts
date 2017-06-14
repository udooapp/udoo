import {InputPage} from './input.po';

describe('LoginPage', function() {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('should Sign In  working', () => {
    page.navigateTo('/login');
    page.setText('udooTest@udoo.com', 'email-input');
    page.setText('password', 'password-input');
    page.setButtonClick('login-button');
    page.isPresent('map').then(message => expect(message == true)).catch(error => expect(false));
  });
  it('should Log Out working', ()=>{
    page.navigateTo('/map');
    page.setButtonClick('menu-button');
    page.setButtonClick('logout-button');
    page.setButtonClick('menu-button');
    page.isPresent('logout-button').then(message => expect(message == true)).catch(error => expect(false));
  })
});
