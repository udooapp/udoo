import {browser, element, by, protractor} from 'protractor';

export class InputPage {
  public navigateTo(route: string) {
    return browser.get(route);
  }

  public waitingForAngular() {
    return browser.waitForAngular();
  }

  public getParagraphText() {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css('app-root h1'))), 1500);
    return element(by.css('app-root h1')).getText();

  }
  public getElementText(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    return element(by.id(id)).getText();

  }

  public setChecked(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css("label[for='" + id + "']"))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.css("label[for='" + id + "']")).click();
  }

  public clearText(id: string){
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.id(id)).clear();
  }

  public setText(text: string, id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.id(id)).sendKeys(text);
  }

  public setButtonClick(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.id(id)).click();

  }

  public isPresent(id: string) {
    return element(by.id(id)).isPresent();
  }

  public setSelectOption(id: string, index: number){
    element(by.id(id)).all(by.tagName('option')).get(index).click();
  }

}
