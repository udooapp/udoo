import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('OfferPage', function () {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  it('Login and create Offer with valid data', () => {
    page.navigateTo(ROUTES.LOGIN);
    page.setText('udooTest@udoo.com', 'email-input');
    page.setText('password', 'password-input');
    page.setButtonClick('login-button');
    page.isPresent('tab-pager').then(() => {
      let date: Date = new Date();
      page.navigateTo(ROUTES.OFFER);
      page.waitingForAngular();
      page.setText('TestOffer' + date.toDateString(), 'title-input');
      page.setSelectOption('category-select', 2);
      page.setText('UdooTestOfferDescription' + date.toDateString(), 'description-area');
      page.setText('Location', 'location-input');
      page.setText('12-12-1992', 'availability-input');
      page.setText('12-12-1993', 'expirydate-input');
      page.setButtonClick('save-button');
      expect(page.getParagraphText()).toEqual('My service offers');
    }).catch(error => expect(false));
  });

  it('Login and create Offer with empty input', () => {
      let date: Date = new Date();
      page.navigateTo(ROUTES.OFFER);
      page.waitingForAngular();
      page.setText('TestOffer' + date.toDateString(), 'title-input');
      page.setSelectOption('category-select', 2);
      page.setText('UdooTestOfferDescription' + date.toDateString(), 'description-area');
      page.setText('12-12-1993', 'expirydate-input');
      page.setButtonClick('save-button');
      expect(page.getElementText('error-message')).toEqual('Incorrect or empty value');
  });
});
