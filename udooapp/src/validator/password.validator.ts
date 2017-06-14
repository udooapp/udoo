import {IValidator} from "./validator.interface";
export class PasswordValidator implements IValidator{
  private errorMessage: string = 'Minimum 5 letter';
  validate(value : string) : boolean{
    return value.length >= 5;
  }
  getErrorMessage() : string{
    return this.errorMessage;
  }

  setErrorMessage(message: string) {
  this.errorMessage = message;
  }
}
