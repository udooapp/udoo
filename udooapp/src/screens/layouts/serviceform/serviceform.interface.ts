import {IFormInterface} from "../form.interface";
export interface IServiceForm extends IFormInterface{

  locationSelected(event);
  onClickSelectLocation();
  onClickDeleteService();
  onSelectChange(event);
  onClickBid(bid, state);
  isUpdate(): boolean;
  isBlur(): boolean;
  onClickCloseFullscreenGallery();
  onClickNewCameraImage(event);
}
