import {Component, OnInit} from '@angular/core';
import {WallService} from "../../../services/wall.service";
import {NotifierController} from "../../../controllers/notify.controller";
import {DialogController} from "../../../controllers/dialog.controller";
import {ConversionMethods} from "../../layouts/conversion.methods";


@Component({
  selector: 'main-wall',
  templateUrl: './wall.main.component.html',
  styleUrls: ['./wall.main.component.css'],
  providers: [WallService]
})
export class MainWallComponent extends ConversionMethods implements OnInit {
  public data: any[] = [];
  private lastDate: Date;
  private scrolledDown: boolean = true;
  private noMoreElement: boolean = false;

  constructor(private dialog: DialogController, private wallService: WallService, private notifier: NotifierController) {
    super();
    this.lastDate = new Date();
    notifier.userScrolledToTheBottom$.subscribe(() => {
      if (!this.scrolledDown && !this.noMoreElement) {
        this.scrolledDown = true;
        this.loadMoreElement();
      }
    });
  }

  ngOnInit(): void {
    this.wallService.getWall(this.lastDate).subscribe(
      data => {
        this.data = data;
        if (data.length > 0) {
          this.lastDate.setTime(data[data.length - 1].date);
        }
        if(data.length < 5){
          this.noMoreElement = true;
        }
        this.scrolledDown = false;
      },
      error => {
        this.scrolledDown = false;
        this.dialog.notifyError(error);
      }
    );
  }

  private loadMoreElement() {
    this.wallService.getWall(this.lastDate).subscribe(
      data => {
        if(data.length < 5){
          this.noMoreElement = true;
        }
        if (data.length > 0) {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          this.lastDate.setTime(data[data.length - 1].date);
        }
        this.scrolledDown = false;
      },
      error => {
        this.scrolledDown = false;
        this.dialog.notifyError(error);
      }
    );
  }

  public getPicture(picture: string) {
    if (picture != null && picture.length > 0 && picture != 'null') {
      return picture;
    }
    return '';
  }
}
