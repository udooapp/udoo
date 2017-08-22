import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('ProfilePage', function () {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('Login and Updating profile with valid data', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.PROFILE);
    page.waitingForAngular();
    page.clearText('name-input');
    page.setText('UdooTest' + date.toDateString(), 'name-input');
    page.setButtonClick('save-button');
  });

  it('Login and Updating profile with invalid data', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.PROFILE);
    page.waitingForAngular();
    page.clearText('name-input');
    page.setText('Udoo' + date.toDateString(), 'phone-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Invalid or empty value');
  });

  it('Login and Updating password with valid data', () => {
    page.navigateTo(ROUTES.PROFILE);
    page.waitingForAngular();
    page.setButtonClick('password-button');
    page.setText('password', 'current-password-input');
    page.setText('password', 'new-password-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('ok-message')).toEqual('Password changed');
  });

  it('Login and Updating password with invalid data', () => {
    page.navigateTo(ROUTES.PROFILE);
    page.waitingForAngular();
    page.setButtonClick('password-button');
    page.setText('password1', 'current-password-input');
    page.setText('password', 'new-password-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Unauthorized');
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('logout-button');
    page.setButtonClick('menu-button');
  });
});
