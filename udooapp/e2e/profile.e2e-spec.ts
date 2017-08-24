import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('ProfilePage', function () {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it(' Updating profile with valid data', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('profile-menu-button');
    page.waitingForAngular();
    page.clearText('name-input');
    page.setText('UdooTest' + date.toDateString(), 'name-input');
    page.setButtonClick('save-button');
  });

  it('Updating profile with invalid data', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('profile-menu-button');
    page.waitingForAngular();
    page.clearText('name-input');
    page.setText('Udoo' + date.toDateString(), 'phone-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Invalid or empty value');
  });

  it('Updating password with valid data', () => {
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('profile-menu-button');
    page.waitingForAngular();
    page.setButtonClick('password-button');
    page.setText('password', 'current-password-input');
    page.setText('password', 'new-password-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('ok-message')).toEqual('Password changed');
  });

  it('Updating password with invalid data', () => {
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('profile-menu-button');
    page.waitingForAngular();
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
