import {IFormInterface} from "../form.interface";
export interface IServiceForm extends IFormInterface{

  locationSelected(event);
  onClickSelectLocation();
  onClickDeleteService();
  onSelectChange(event);
  isUpdate(): boolean;
}
