import {IValidator} from "./validator.interface";
export class PhoneValidator implements IValidator {
  private errorMessage: string = 'Invalid phone number format';

  validate(value: string): boolean {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\. ]?[0-9]{3}[-\s\. ]?[0-9]{4,6}$/im.test(value.replace( /[-\s\. ]/gi, ''));
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
