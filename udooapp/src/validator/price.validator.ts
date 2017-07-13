import {IValidator} from "./validator.interface";
export class PriceValidator implements IValidator {
  private errorMessage: string = 'It is not a price! Example: 1.99';

  validate(value: string): boolean {
    return /^([0-9]*[.])?[0-9]{1,4}$/im.test(value);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
