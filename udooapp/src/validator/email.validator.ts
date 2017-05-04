import {IValidator} from "./validator.interface";
export class EmailValidator implements IValidator{
  validate(value : string) : boolean{
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
  }
  getText() : string{
    return 'Email address most be contain \'@\' and \'.\'';
  }

}
