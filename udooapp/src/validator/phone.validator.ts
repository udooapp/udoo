import {IValidator} from "./validator.interface";
export class PhoneValidator implements IValidator {
  private errorMessage: string = 'Format: +4312345678';

  validate(value: string): boolean {
    return /^[\+43][(]?[0-9]{2}[)]?[-\s\. ]?[0-9]{3}[-\s\. ]?[0-9]{4,6}$/im.test(value.replace( /[-\s\. ]/gi, ''));
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
