import {Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ChatService} from "../../services/chat.service";
import {Router} from "@angular/router";
import {UserController} from "../../controllers/user.controller";
import {MainComponent} from "../main/main.component";
import {ROUTES} from "../../app/app.routing";
import {BookmarkService} from "../../services/bookmark.service";

@Component({
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
  providers: [ChatService, BookmarkService]
})
export class BookmarkComponent implements OnInit {

  public data: any = [];
  public error: string;
  public message: string = '';
  public loading: boolean = false;
  public noMore: boolean = false;

  constructor(private bookmarkService: BookmarkService, private userController: UserController, private dialog: DialogController, private notifier: NotifierController, private router: Router) {
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.userScrollDown();
    });
  }

  private userScrollDown() {
    if (!this.loading && !this.noMore) {
      this.loading = true;
      this.bookmarkService.get(this.data.length).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          if (data.length < MainComponent.PAGE_SIZE) {
            this.noMore = true;
          }
          this.loading = false;
        },
        error => {
          this.error = <any>error;
          this.dialog.notifyError(this.error);
          this.loading = false;
        });
    }
  }

  public ngOnInit() {
    this.loading = true;
    this.bookmarkService.get(0).subscribe(
      data => {
        this.loading = false;
        this.data = data;
        if (data.length < MainComponent.PAGE_SIZE) {
          this.noMore = true;
        }
      },
      error => {
        this.loading = false;
        this.error = <any>error;
        this.dialog.notifyError(this.error)
      });
  }
  public onClickBookmark(item){

  }
  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return './assets/profile_picture.png';
    }
    return url;
  }

  public onClickConversation(item: any) {
    if (item != null) {
      if (item.newMessage) {
        this.userController.refreshUser();
      }
      this.router.navigate([ROUTES.CHAT + item.uid]);
    }
  }
}

