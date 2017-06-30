import {Component, EventEmitter, Input, Output} from '@angular/core';

import 'rxjs/add/operator/switchMap';
import {DialogController} from "../../controllers/dialog.controller";
@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent{

  public static IMAGE:string = "GALLERY_IMAGE";

  message: string = '';
  gallery: boolean = false;
  index: number = 0;
  @Input() images: any[] = [];
  @Input() editable:boolean = false;
  @Input() loading:number[] = [];
  @Input() error:number[] = [];
  @Output() onClickRemove: EventEmitter<number> = new EventEmitter();
  @Output() onClickImage: EventEmitter<number> = new EventEmitter();
  @Output() onClickNewImage: EventEmitter<any> = new EventEmitter();
  constructor() {
  }
  @Input() set close(value: number){
      this.gallery = false;
  }
  public onClickDelete(i: number){
    this.onClickRemove.emit(i)
  }
  public onClickNew(event){
    this.onClickNewImage.emit(event);
  }
  public getPictureUrl(image:string) {
    if (image == null || image.length == 0 || image === 'null') {
      return '';
    }
    return image;
  }

  public onClickPicture(i:number){
    this.gallery = true;
    this.index = i;
    this.onClickImage.emit(i);
  }
  public onClickPrevious(){
    if(this.index > 0) {
      --this.index;
    }
  }
  public onClickNext(){
    if(this.index < this.images.length){
      ++this.index;
    }
  }
  isLoading(index:number) : boolean{
    for(let i = 0; i < this.loading.length; ++i){
      if(this.loading[i] === index){
        return true;
      }
    }
    return false;
  }
  isError(index: number): boolean{
    for(let i = 0; i < this.error.length; ++i){
      if(this.error[i] === index){
        return true;
      }
    }
    return false;
  }
}
