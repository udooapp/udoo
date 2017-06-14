import {IValidator} from "./validator.interface";
export class DateValidator implements IValidator {
  private errorMessage = 'It is not a date! Format: yyyy/mm/dd';

  validate(value: string): boolean {
    return /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/im.test(value);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
