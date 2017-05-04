import {IValidator} from "./validator.interface";
export class TimeValidator implements IValidator{
  validate(value : string) : boolean{
    return /^[0-9]{1,2}:[0-9]{1,2}([ ][0-9]{1,2})?$/im.test(value);
  }
  getText() : string{
    return 'It is not a time! Format: hh:mm (ss)';
  }

}
