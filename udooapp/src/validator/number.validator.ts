import {IValidator} from "./validator.interface";
export class NumberValidator implements IValidator {
  private errorMessage: string = 'It is not a number';

  validate(value: string): boolean {
    return /^[0-9]*$/im.test(value);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
