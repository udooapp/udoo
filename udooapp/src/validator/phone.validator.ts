import {IValidator} from "./validator.interface";
export class PhoneValidator implements IValidator{
  validate(value : string) : boolean{
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value);
  }
  getText() : string{
    return 'Invalid phone number format';
  }
}
