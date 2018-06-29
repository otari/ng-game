import { EubetappPage } from './app.po';

describe('eubetapp App', () => {
  let page: EubetappPage;

  beforeEach(() => {
    page = new EubetappPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
