import {IFormInterface} from "../form.interface";
export interface IServiceForm extends IFormInterface{

  locationSelected(event);
  onClickSelectLocation();
  onClickDelete();
  onSelectChange(event);
  isUpdate(): boolean;
}
