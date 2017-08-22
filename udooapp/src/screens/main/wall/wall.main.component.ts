import {Component, Input, OnInit} from '@angular/core';
import {WallService} from "../../../services/wall.service";
import {NotifierController} from "../../../controllers/notify.controller";
import {DialogController} from "../../../controllers/dialog.controller";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {Router} from "@angular/router";
import {CHAT, CONTACT, DETAIL} from "../../../app/app.routing.module";
import {UserController} from "../../../controllers/user.controller";
import {MainSearchListener} from "../main.search.listener";
import {MainComponent} from "../main.component";


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

  public data: any[] = [];
  private lastId: number = 0;
  public scrolledDown: boolean = true;
  private noMoreElement: boolean = false;
  @Input() searchListener: MainSearchListener;

  constructor(private userController: UserController, private dialog: DialogController, private wallService: WallService, private notifier: NotifierController, private router: Router) {
    super();
    notifier.userScrolledToTheBottom$.subscribe(() => {
      if (!this.scrolledDown && !this.noMoreElement) {
        this.scrolledDown = true;
        this.loadMoreElement();
      }
    });
    userController.logoutDataPipe$.subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.wallService.getWall(this.lastId).subscribe(
      data => {
        this.data = data;
        if (data.length > 0) {
          this.lastId = data[data.length - 1].hid;
        }
        if (data.length < MainComponent.PAGE_SIZE) {
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
    this.wallService.getWall(this.lastId).subscribe(
      data => {
        if (data.length < MainComponent.PAGE_SIZE) {
          this.noMoreElement = true;
        }
        if (data.length > 0) {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          this.lastId = data[data.length - 1].hid;
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

  public pictureText(count: number): string {
    return 'added ' + (count == 1 ? 'a new photo' : count + ' new photos');
  }

  public countPicture(items: any[]): number {
    let count: number = 0
    for (let i = 0; i < items.length; ++i) {
      if (items[i].type == 3) {
        ++count;
      }
    }
    return count;
  }

  public getPictures(items: any[]): string[] {
    let pictures: string[] = [];
    for (let i = 0; i < items.length; ++i) {
      if (items[i].type == 3) {
        pictures.push(items[i].before);
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

  public getUpdateType(action: number): string {
    switch (action) {
      case this.UPDATED_PICTURE:
        return 'profile picture';
      case this.UPDATED_TITLE_OR_NAME:
        return 'name';
      case this.UPDATED_PHONE_NUMBER:
        return 'phone number';
      case this.UPDATED_EMAIL_ADDRESS:
        return 'email address';
    }
    return '';
  }

  public isUserUpdate(item: any) {
    return item.type == 0;
  }

  public getUserModification(item: any): string {
    return item.type == 0 ? 'registered on the site' : 'updated his ' + this.getUpdateType(item.type) + ' to ';
  }

  public getServiceModificationText(item: any) {
    switch (item.type) {
      case this.UPDATED_TITLE_OR_NAME:
        return 'updated title ';
      case this.UPDATED_PHONE_NUMBER:
        return 'updated title ';
      case this.UPDATED_EMAIL_ADDRESS:
        return 'updated address ';
      case this.UPDATED_DESCRIPTION:
        return 'updated description ';
      case this.UPDATED_EXPIRATION_DATE:
        return 'updated expiration date ';
      case this.UPDATED_LOCATION:
        return 'updated location ';
      case this.UPDATED_CATEGORY:
        return 'updated category ';
      case this.UPDATED_AVAILABILITY:
        return 'updated availability ';
      case this.UPDATED_JOB_DATE:
        return 'updated job date ';
    }
  }

  public getContent(content) {
    return ' ' + (content == null ? ' ' : (content.length > 203 ? content.substr(0, 200) + '...' : content)) + ' ';
  }

  public onClickServiceName(type: number, id: number) {
    if(this.searchListener != null) {
      this.searchListener.onClickService(id, type == 1, null);
    }
  }
  public isContainData(element: any){
    return element.before && element.before.length > 0 && element.after && element.after.length > 0
  }
  public isContainValidData(type: number, content: any[]){
    if(type > 0) {
      for (let item of content) {
        if (item.before && item.before.length > 0 && item.after && item.after.length > 0) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }
  public onClickMessage(uid: number){
    this.router.navigate([CHAT + uid]);
  }
}
