import {IValidator} from "./validator.interface";
export class PasswordValidator implements IValidator{
  validate(value : string) : boolean{
    return value.length >= 5;
  }
  getText() : string{
    return 'Minimum 5 letter';
  }
}
