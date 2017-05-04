import {IValidator} from "./validator.interface";
export class DateValidator implements IValidator{
  validate(value : string) : boolean{
    return /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/im.test(value);
  }
  getText() : string{
    return 'It is not a date! Format: yyyy/mm/dd';
  }

}
