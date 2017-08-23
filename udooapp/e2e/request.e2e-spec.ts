import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('RequestPage', function () {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('Login and create Request with valid data', () => {
    page.navigateTo(ROUTES.LOGIN);
    page.setText('udooTest@udoo.com', 'email-input');
    page.setText('password', 'password-input');
    page.setButtonClick('login-button');
    page.isPresent('tab-pager').then(() => {
      let date: Date = new Date();
      page.navigateTo(ROUTES.REQUEST);
      page.waitingForAngular();
      page.setText('TestRequest' + date.toDateString(), 'title-input');
      page.setSelectOption('category-select', 2);
      page.setText('UdooTestRequestDescription' + date.toDateString(), 'description-area');
      page.setText('Location', 'location-input');
      page.setText('12-12-1992', 'date-input');
      page.setText('22:12', 'time-input');
      page.setText('10', 'number-input');
      page.setText('12-12-1993', 'expirydate-input');
      page.setButtonClick('save-button');
      expect(page.getParagraphText()).toEqual('My service requests');
    }).catch(error => expect(false));
  });

  it('Login and create Request with empty input', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.REQUEST);
    page.waitingForAngular();
    page.setText('TestRequest' + date.toDateString(), 'title-input');
    page.setSelectOption('category-select', 2);
    page.setText('UdooTestRequestDescription' + date.toDateString(), 'description-area');
    page.setText('Location', 'location-input');
    page.setText('12-12-1992', 'date-input');
    page.setText('22:12', 'time-input');
    page.setText(date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear(), 'expirydate-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Incorrect or empty value');
  });
});
