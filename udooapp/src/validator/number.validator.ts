import {IValidator} from "./validator.interface";
export class NumberValidator implements IValidator{
  validate(value : string) : boolean{
    return /^[0-9]*$/im.test(value);
  }
  getText() : string{
    return 'It is not a number';
  }

}
