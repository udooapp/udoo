import {IValidator} from "./validator.interface";
export class TimeValidator implements IValidator {
  private errorMessage: string = 'It is not a time! Format: hh:mm (ss)';

  validate(value: string): boolean {
    return /^[0-9]{1,2}:[0-9]{1,2}([ ][0-9]{1,2})?$/im.test(value);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
