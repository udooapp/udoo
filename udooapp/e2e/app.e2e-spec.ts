import { UdooappPage } from './app.po';

describe('udooapp App', function() {
  let page: UdooappPage;

  beforeEach(() => {
    page = new UdooappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
