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
  public wait(millis: number){
    return browser.sleep(millis);
  }
  public getElementText(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    return element(by.id(id)).getText();

  }

  public clickOnScreen(posX: number, posY: number) {
    return browser.actions().mouseMove({x: posX, y: posY}).click().doubleClick().perform();
  }

  public setChecked(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.css("label[for='" + id + "']"))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    return element(by.css("label[for='" + id + "']")).click();
  }

  public clearText(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    return element(by.id(id)).clear();
  }

  public setText(text: string, id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.id(id)).sendKeys(text);
  }

  public setButtonClick(id: string) {
    browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id(id))), 1500, 'Element taking too long to appear in the DOM. Id: ' + id);
    element(by.id(id)).click();

  }
  public writeLogs() {
    browser.manage().logs().get('browser').then(function (browserLogs) {
      // browserLogs is an array of objects with level and message fields
      browserLogs.forEach(function (log) {
        if (log.level.value > 0) { // it's an error log
          console.log('Browser console error!');
          console.log(log.message);
        }
      });
    });
  }

  public isPresent(id: string) {
    return element(by.id(id)).isPresent();
  }

  public setSelectOption(id: string, index: number) {
    element(by.id(id)).all(by.tagName('option')).get(index).click();
  }

}
