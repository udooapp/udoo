export interface IFormInterface{
  getTitle(): string;
  showElements():boolean;
  fieldValidate(index: number, value: boolean);
  onClickSave();
}
