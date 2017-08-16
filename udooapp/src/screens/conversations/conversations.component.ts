import {Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ChatService} from "../../services/chat.service";
import {Router} from "@angular/router";
import {CHAT} from "../../app/app.routing.module";

@Component({
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
  providers: [ChatService]
})
export class ConversationComponent implements OnInit {
  private RESPONSE_DATA_SIZE: number = 5;

  public data: any = [];
  public error: string;
  public message: string = '';
  public loading: boolean = false;
  public noMore: boolean = false;

  constructor(private chatService: ChatService, private dialog: DialogController, private notifier: NotifierController, private router: Router) {
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
      this.chatService.getUserConversations(this.data.length).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          if (data.length < this.RESPONSE_DATA_SIZE) {
            this.noMore = true;
          }
          this.loading = false;
        },
        error => {
          this.error = <any>error;
          this.dialog.notifyError(this.error)
          this.loading = false;
        });
    }
  }

  public ngOnInit() {
    this.loading = true;
    this.chatService.getUserConversations(0).subscribe(
      data => {
        this.loading = false;
        this.data = data;
        if (data.length < this.RESPONSE_DATA_SIZE) {
          this.noMore = true;
        }
      },
      error => {
        this.loading = false;
        this.error = <any>error;
        this.dialog.notifyError(this.error)
      });
  }

  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }
  public onClickConversation(item: any){
    if(item != null){
      this.router.navigate([CHAT + item.uid]);
    }
  }
}

