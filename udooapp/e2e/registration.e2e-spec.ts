import { InputPage } from './input.po';

describe('RegistrationPage', function() {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('User Registration with valid data', () => {
    let date: Date = new Date();
    page.navigateTo('/registration');
    page.setChecked('personal');
    page.setText('test' + date.toDateString(), 'name-input');
    page.setText('test' + date.getFullYear()+ "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getMilliseconds() + '@udoo.com', 'email-input');
    page.setText('password1', 'password-input');
    page.setText('password1', 'password-verification-input');
    page.setText('0123456789','phone-input');
    page.setText('12-12-1992', 'birth-date-input');
    page.setButtonClick('save-button');
    expect(page.getParagraphText()).toEqual('Sign in');
  });

  it('User Registration with invalid data', () => {
    let date: Date = new Date();
    page.navigateTo('/registration');
    page.setChecked('personal');
    page.setText('test' + date.toDateString(), 'name-input');
    page.setText('test' + date.getFullYear()+ "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getMilliseconds() + '@udoo.com', 'email-input');
    page.setText('password1', 'password-input');
    page.setText('password1', 'password-verification-input');
    page.setText('012345678','phone-input');
    page.setText('12-12-1992', 'birth-date-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Invalid or empty value');
  });

  it('Organization Registration with valid data', () => {
    let date: Date= new Date();
    page.navigateTo('/registration');
    page.setChecked('organization');
    page.setText('test' + date.toDateString(), 'name-input');
    page.setText('test' + date.getFullYear()+ "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getMilliseconds() + '@udoo.com', 'email-input');
    page.setText('password1', 'password-input');
    page.setText('password1', 'password-verification-input');
    page.setText('0123456789','phone-input');
    page.setButtonClick('save-button');
    expect(page.getParagraphText()).toEqual('Sign in');
  });

  it('Organization Registration with invalid data', () => {
    let date: Date = new Date();
    page.navigateTo('/registration');
    page.setChecked('organization');
    page.setText('test' + date.toDateString(), 'name-input');
    page.setText('test' + date.getFullYear()+ "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getMilliseconds() + '@udoo.com', 'email-input');
    page.setText('password1', 'password-input');
    page.setText('password1', 'password-verification-input');
    page.setText('012345678','phone-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Invalid or empty value');
  });
});
