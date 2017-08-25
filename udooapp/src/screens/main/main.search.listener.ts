export interface MainSearchListener{
  onClickService(id: number, type: boolean, location: string);
  loadMoreElementList();
  onBidClickSendOffer(type: boolean, id: number);
  getData(page: number)
}
