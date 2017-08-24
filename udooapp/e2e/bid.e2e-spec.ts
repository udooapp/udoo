import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('SendOfferPage', function () {
  let page: InputPage;
  let message = 'Ut condimentum egestas tellus in elementum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat sed risus eget accumsan.';
  beforeEach(() => {
    page = new InputPage();
  });

  it('Login and send an offer and after log out', () => {
    page.navigateTo(ROUTES.LOGIN);
    page.isPresent('email-input').then(() => {
      page.setText('udooTest@udoo.com', 'email-input');
      page.setText('password', 'password-input');
      page.setButtonClick('login-button');
      page.waitingForAngular();
      page.isPresent('main-list-service-container0').then(() => {
        page.setButtonClick('main-list-service-container0');
        page.waitingForAngular();
        page.setButtonClick('service-dialog-send-offer-button');
        page.waitingForAngular();
        page.setText(Math.floor(Math.random() * 50).toString(), 'bid-dialog-price');
        page.setText(message, 'bid-dialog-description');
        page.setButtonClick('bid-dialog-send-offer');
        page.getElementText('dialog-message').then(() => {
          page.navigateTo(ROUTES.MAIN);
          page.waitingForAngular();
          page.setButtonClick('menu-button');
          page.setButtonClick('logout-button');
          page.waitingForAngular();
          page.setButtonClick('menu-button');
          page.isPresent('login-menu-button').then(message => expect(message === true)).catch(error => expect(false));
        }).catch(error => expect(false));
      });
    });
  });

});
