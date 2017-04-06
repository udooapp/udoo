import { UdooClientPage } from './app.po';

describe('udoo-client App', () => {
  let page: UdooClientPage;

  beforeEach(() => {
    page = new UdooClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
