export interface MainSearchListener{
  onClickService(id: number, type: boolean, location: string);
  loadMoreElementMap();
  onBidClickSendOffer(type: boolean, id: number);
  getData(page: number)
}
