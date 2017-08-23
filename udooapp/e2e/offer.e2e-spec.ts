import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

fdescribe('OfferPage', function () {
  let page: InputPage;

  beforeEach(() => {
    page = new InputPage();
  });

  fit('Login and create Offer with valid data', () => {
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
    //   page.setButtonClick('location-input').catch(()=>{expect(false)});
    //   let xpos = Math.random() * 50 + 200;
    //   let ypos = Math.random() * 50 + 300;
    //   page.clickOnScreen(xpos, ypos).catch(()=>{expect(false)});
    //  page.setButtonClick('location-location-save-button').catch(()=>{expect(false)});
      page.setText('12-12-1992', 'availability-input');
      page.setText(date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear(), 'expirydate-input');
      page.setButtonClick('save-button');
      page.waitingForAngular();
      page.getParagraphText().then(value => {
        expect(value === 'My service offers');
      }).then(()=>{expect(false)});

    }).catch(error => expect(false));
  });

  it('Login and create Offer with empty input', () => {
    let date: Date = new Date();
    page.navigateTo(ROUTES.OFFER);
    page.waitingForAngular();
    page.setText('TestOffer' + date.toDateString(), 'title-input');
    page.setSelectOption('category-select', 2);
    page.setText('UdooTestOfferDescription' + date.toDateString(), 'description-area');
    page.setText(date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear(), 'expirydate-input');
    page.setButtonClick('save-button');
    expect(page.getElementText('error-message')).toEqual('Incorrect or empty value');
  });
});
