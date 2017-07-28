import {Component, Input, OnInit} from '@angular/core';
import {WallService} from "../../../services/wall.service";
import {NotifierController} from "../../../controllers/notify.controller";
import {DialogController} from "../../../controllers/dialog.controller";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {Router} from "@angular/router";
import {CONTACT, DETAIL} from "../../../app/app.routing.module";
import {type} from "os";


@Component({
  selector: 'main-wall',
  templateUrl: './wall.main.component.html',
  styleUrls: ['./wall.main.component.css'],
  providers: [WallService]
})
export class MainWallComponent extends ConversionMethods implements OnInit {

  private UPDATED_DESCRIPTION = 2;
  private UPDATED_PICTURE = 3;
  private UPDATED_EXPIRATION_DATE = 4;
  private UPDATED_LOCATION = 5;
  private UPDATED_TITLE_OR_NAME = 6;
  private UPDATED_AVAILABILITY = 7;
  private UPDATED_JOB_DATE = 8;
  private UPDATED_CATEGORY = 9;
  private UPDATED_PHONE_NUMBER = 10;
  private UPDATED_EMAIL_ADDRESS = 11;

  @Input() categories: any[] = [];
  public data: any[] = [];
  private lastDate: Date;
  public scrolledDown: boolean = true;
  private noMoreElement: boolean = false;

  constructor(private dialog: DialogController, private wallService: WallService, private notifier: NotifierController, private router: Router) {
    super();
    this.lastDate = new Date();
    notifier.userScrolledToTheBottom$.subscribe(() => {
      if (!this.scrolledDown && !this.noMoreElement) {
        this.scrolledDown = true;
        this.loadMoreElement();
      }
    });
    notifier.userLogOut$.subscribe(value => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.wallService.getWall(this.lastDate).subscribe(
      data => {
        console.log(data);
        this.data = data;
        if (data.length > 0) {
          this.lastDate.setTime(data[data.length - 1].date);
        }
        if (data.length < 5) {
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
        console.log(data);
        if (data.length < 5) {
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

  public getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category with ' + category + ' id is not exist!';
  }

  public getPicture(picture: string) {
    if (picture != null && picture.length > 0 && picture != 'null') {
      return picture;
    }
    return '';
  }

  public onClickContent(item: any) {
    if (item != null) {
      this.router.navigate([item.type == 0 ? CONTACT : DETAIL + "/" + item.id + "/" + (item.type == 1 ? "1" : "0") + "/0"]);
    }
  }

  public cointainPicture(items: any[]): boolean {
    for (let i = 0; i < items.length; ++i) {
      if (items[i].type == 3) {
        return true;
      }
    }
    return false;
  }

  public getPictures(items: any[]): string[] {
    let pictures: string[] = [];
    for (let i = 0; i < items.length; ++i) {
      if (items[i].type == 3) {
        pictures.push(items[i].content);
      }
    }
    return pictures;
  }

  public isUpdate(items: any[]): boolean {
    if (items.length > 1) {
      return true;
    } else if (items.length == 1) {
      if (items[0].type == 0) {
        return false;
      }
    }
    return true;
  }

  public getUpdateType(contentType: number, action: number): string {
    switch (contentType) {
      case 0:
        switch (action) {
          case this.UPDATED_PICTURE:
            return 'picture';
          case this.UPDATED_TITLE_OR_NAME:
            return 'name';
          case this.UPDATED_PHONE_NUMBER:
            return 'phone number';
          case this.UPDATED_EMAIL_ADDRESS:
            return 'email address';
        }
        break;
      case 1:
        switch (action) {
          case this.UPDATED_DESCRIPTION:
            return 'description';
          case this.UPDATED_PICTURE:
            return 'picture';
          case this.UPDATED_EXPIRATION_DATE:
            return 'expiration date';
          case this.UPDATED_LOCATION:
            return 'location';
          case this.UPDATED_TITLE_OR_NAME:
            return 'title';
          case this.UPDATED_CATEGORY:
            return 'category';
          case this.UPDATED_AVAILABILITY:
            return 'availability'
        }
        break;
      case 2:
        switch (action) {
          case this.UPDATED_DESCRIPTION:
            return 'description';
          case this.UPDATED_PICTURE:
            return 'picture';
          case this.UPDATED_EXPIRATION_DATE:
            return 'expiration date';
          case this.UPDATED_LOCATION:
            return 'location';
          case this.UPDATED_CATEGORY:
            return 'category';
          case this.UPDATED_JOB_DATE:
            return 'job date';
          case this.UPDATED_TITLE_OR_NAME:
            return 'title';

        }
        break;
    }
    return '';
  }

  public getTitle(item: any): string {
    let title: string = '';
    if (!this.isUpdate(item.content)) {
      title = item.type == 0 ? 'registered on the site' : ('create a new ' + (item.type == 1 ? 'offer ' : 'request ') + "with title " + item.serviceName);
    } else {
      let typeName: string = item.type == 0 ? 'profile' : item.type == 1 ? 'offer' : 'request';
      title = 'updated his ' + (item.type == 0 ? (item.content.lenght > 1 ? typeName : this.getUpdateType(0, item.content[0].type)) : (item.serviceName + (item.content.length > 1 ? ' ' + typeName : ' ' + typeName + this.getUpdateType(item.type, item.content[0].type))));
    }
    return title;
  }

  public getCoordinates(location: string) {
    if (!location.match('address') && !location.match('coordinate')) {
      return null;
    }
    return JSON.parse(location).address;
  }

  public getUpdateText(item: any, type: number, content: string): string {
    switch (type) {
      case this.UPDATED_TITLE_OR_NAME:
        return item.type > 0 ? item.serviceName : item.userName;
      case this.UPDATED_PHONE_NUMBER:
        return content;
      case this.UPDATED_EMAIL_ADDRESS:
        return content;
      case this.UPDATED_DESCRIPTION:
        return content.substr(0, 200);
      case this.UPDATED_EXPIRATION_DATE:
        return this.convertNumberToDateTime(Number.parseInt(content));
      case this.UPDATED_LOCATION:
        return this.getCoordinates(content);
      case this.UPDATED_CATEGORY:
        return this.getCategory(Number.parseInt(content));
      case this.UPDATED_AVAILABILITY:
        return content;
      case this.UPDATED_JOB_DATE:
        return content;
    }
    return '';
  }
}
