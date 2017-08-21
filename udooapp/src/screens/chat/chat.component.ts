import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ChatService} from "../../services/chat.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserController} from "../../controllers/user.controller";
import {CONVERSATIONS} from "../../app/app.routing.module";

@Component({
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private RESPONSE_DATA_SIZE: number = 5;
  private PAGE_NAME: string = 'CHAT_WINDOW';
  public userPicture: string = '';
  public data: any = [];
  public message: string = '';
  public loading: boolean = true;
  public noMore: boolean = false;
  private isScroll: boolean = false;
  private partnerId: number = -1;
  private partnerPicture: string = '';

  constructor(private userController: UserController, private route: ActivatedRoute, private chatService: ChatService, private dialog: DialogController, private notifier: NotifierController, private router: Router) {
    dialog.errorResponse$.subscribe(() => {
      this.ngOnInit();
    });
    userController.userDataPipe$.subscribe(value => {
      if (value != null && value.user.picture) {
        this.userPicture = value.user.picture;
      } else {
        this.userPicture = '';
      }
    });
    notifier.notify(this.PAGE_NAME);
    notifier.pageChanged$.subscribe(value => {
      if (value == this.PAGE_NAME) {
        this.router.navigate([CONVERSATIONS]);
      }
    })
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
          this.loading = false;
        });
    }
  }

  public ngOnInit() {
    this.loadElements(false);
    this.userController.refreshUser();
    this.route.params
      .subscribe((params: Params) => {
        this.partnerId = +params['id'];
        this.chatService.getMessagesData(this.partnerId).subscribe(value => {
          this.partnerPicture = value.picture;
          this.data = value.messages;
        });
        this.chatService.setChecked(this.partnerId).subscribe(
          ()=>{},
          error2 => {this.dialog.notifyError(error2)}
        );
        this.loading = false;
      });
  }

  ngAfterViewChecked(): void {
    if (!this.isScroll) {
      let e = document.getElementById('chat-container');
      if (e != null) {
        e.scrollTop = e.scrollHeight;
      }
    }
  }

  public containerScrolling() {
    this.isScroll = true;
    let e = document.getElementById('chat-container');
    if (e != null) {
      if (e.scrollTop < 50) {
        this.loadElements(true);
      }
    }
  }

  private loadElements(scrollTop: boolean) {
    let scrollHeight = 0;
    if (scrollTop) {
      let e = document.getElementById('chat-container');
      if (e != null) {
        scrollHeight = e.scrollHeight;
        this.loading = true;
      }
    }
  }

  public onClickSend() {
    if (this.message.length > 0) {
      this.chatService.sendMessage(this.message, this.partnerId).subscribe(
        value => {
          this.data.push(value), this.message = '';
        },
        error => {
          this.dialog.notifyError(error);
        }
      )
    }
  }
}

