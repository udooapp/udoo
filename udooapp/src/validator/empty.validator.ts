import {IValidator} from "./validator.interface";
export class EmptyValidator implements IValidator {
  private errorMessage: string = 'Mandatory';

  validate(value: string): boolean {
    return value.length > 0;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
