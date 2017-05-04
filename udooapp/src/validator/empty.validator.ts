import {IValidator} from "./validator.interface";
export class EmptyValidator implements IValidator{
  validate(value : string) : boolean{
    return value.length > 0;
  }
  getText() : string{
    return 'Mandatory';
  }
}
