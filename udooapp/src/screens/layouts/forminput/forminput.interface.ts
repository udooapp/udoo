import {IFormInterface} from "../form.interface";
export interface IFormInput extends IFormInterface{
  onKeyPassword(event);

  disableEmailInput():boolean;
}
