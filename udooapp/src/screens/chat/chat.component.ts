import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ChatService} from "../../services/chat.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserController} from "../../controllers/user.controller";
import {MainComponent} from "../main/main.component";
import {ROUTES} from "../../app/app.routing";

@Component({
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, AfterViewChecked{
  private PAGE_NAME: string = 'CHAT_WINDOW';
  public userPicture: string = '';
  public data: any = [];
  public message: string = '';
  public loading: boolean = true;
  public noMore: boolean = false;
  private isScroll: boolean = false;
  private partnerId: number = -1;
  private partnerPicture: string = '';
  private showMessageBoxDate: number = -1;
  private scrollHeight: number = 0;

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
        this.router.navigate([ROUTES.CONVERSATIONS]);
      }
    })
  }

  public ngOnInit() {
    this.userController.refreshUser();
    this.route.params
      .subscribe((params: Params) => {
        this.partnerId = +params['id'];
        this.chatService.getMessagesData(this.partnerId).subscribe(value => {
          this.partnerPicture = value.picture;
          if(value.messages) {
            this.data = value.messages;
          }
        });
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
        let e = document.getElementById('chat-container');
        if (e != null) {
          this.scrollHeight = e.scrollHeight;
          if (!this.loading && !this.noMore) {
            this.loading = true;
            this.chatService.getUserMessages(this.partnerId, this.data.length).subscribe(
              data => {
                for (let i = 0; i < data.length; ++i) {
                  this.data.splice(i, 0, data[i]);
                }
                if (data.length < MainComponent.PAGE_SIZE) {
                  this.noMore = true;
                }
                this.loading = false;
                if (this.scrollHeight != 0) {
                  let e = document.getElementById('chat-container');
                  if (e != null) {
                    e.scrollTop = e.scrollHeight - this.scrollHeight;
                  }
                  this.scrollHeight = 0;
                }
              },
              error => {
                this.dialog.notifyError(error);
                this.loading = false;
              });
          }
        }
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

  public onClickMessageBox(index: number) {
    if (this.showMessageBoxDate == index) {
      this.showMessageBoxDate = -1;
    } else {
      this.showMessageBoxDate = index;
    }
  }
}

