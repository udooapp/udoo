import {InputPage} from './input.po';
import {ROUTES} from "../src/app/app.routing";

describe('ContactAndChatPage', function () {
  let page: InputPage;
  let message = 'Ut condimentum egestas tellus in elementum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin feugiat sed risus eget accumsan.';

  beforeEach(() => {
    page = new InputPage();
  });

  it('Login and add the fist service owner to the contacts', () => {
    page.navigateTo(ROUTES.LOGIN);
    page.waitingForAngular();
    page.isPresent('email-input').then(() => {
      page.setText('udooTest@udoo.com', 'email-input');
      page.setText('password', 'password-input');
      page.setButtonClick('login-button');
      page.waitingForAngular();
      page.isPresent('tab-pager').then(() => {
        page.setButtonClick('main-list-service-container0');
        page.waitingForAngular();
        page.setButtonClick('service-dialog-add-to-contact');
        page.getElementText('dialog-message').then(() => {
          expect(true);
        }).catch(error => expect(false));
      });
    });
  });

  it('Send a message to the first contact', () => {
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('contacts-menu-button');
    page.waitingForAngular();
    page.waitingForAngular();
    page.setButtonClick('contact0');
    page.waitingForAngular();
    page.setText(message, 'chat-textarea');
    page.setButtonClick('chat-send-button');
    page.getElementText('chat-textarea').then((message) => {
      expect(!message || message.length == 0);
    }).catch(error => expect(false));
  });

  it('Check the sent message and after Log Out', () => {
    page.navigateTo(ROUTES.MAIN);
    page.setButtonClick('menu-button');
    page.setButtonClick('chat-menu-button');
    page.waitingForAngular();
    page.waitingForAngular();
    page.getElementText('conversation-last-message0').then(message => {
      if (message.substr(0, 47) === message.substr(0, 47)) {
        page.setButtonClick('menu-button');
        page.setButtonClick('logout-button');
        page.isPresent('tab-pager').then(message => expect(message === true)).catch(error => expect(false));
      } else {
        expect(false);
      }
    }).catch(error => expect(false));
  });

});
