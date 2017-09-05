import {Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {Router} from "@angular/router";
import {BidService} from "../../services/bid.service";
import {MainComponent} from "../main/main.component";
import {ROUTES} from "../../app/app.routing";

@Component({
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.css'],
  providers: [BidService]
})

export class BidComponent implements OnInit {
  data: any[] = [];
  error: string;
  message: string = '';
  index: number = 0;
  id: number = 0;
  loading: boolean = false;
  noMore: boolean = false;
  private buttonId: number = -1;
  private clickedIndex = 0;

  constructor(private bidService: BidService, private dialog: DialogController, private notifier: NotifierController, private router: Router) {
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.userScrollDown();
    });
    this.dialog.questionResponse$.subscribe((value) => {
      if(this.buttonId > -1 && value){
        switch (this.buttonId){
          case 0:{
            this.bidService.cancelBid(this.data[this.clickedIndex].bid).subscribe(() => {
              this.data.splice(this.clickedIndex, 1)
            }, error => {
              this.dialog.notifyError(error);
            });
          }
          case 1:{
            this.bidService.confirmBid(this.data[this.clickedIndex].bid).subscribe(() => {
              this.data[this.clickedIndex].status = 2
            }, error => {
              this.dialog.notifyError(error);
            });
          }
        }
        this.clickedIndex = 0;
        this.buttonId = -1;
      }
    })
  }

  private userScrollDown() {
    if (!this.loading && !this.noMore) {
      this.loading = true;
      let length = this.data.length;
      let lastId = length > 0 ? this.data[length - 1].sid : -1;
      this.bidService.getBids(length, lastId).subscribe(
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
          this.loading = false;
        });
    }
  }

  ngOnInit() {
    this.loading = true;

    this.bidService.getBids(0, -1).subscribe(
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

  public getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  public getStatus(status: number, paymentStatus: number) {
    if(paymentStatus == 4){
      return 'Paid'
    }
    switch (status) {
      case 0:
        return 'Decline';
      case 1:
        return 'Accepted';
      case 2:
        return 'Confirmed';
      case -1:
        return 'Pending';
    }
  }

  public getColor(status: number) {
    switch (status) {
      case 0:
        return 'red';
      case 1:
        return '#2B6665';
      case 2:
        return 'green';
      case -1:
        return '#ff8c00';
    }
  }

  public cancelBid(index: number) {
    if (index > 0 && index < this.data.length) {
      this.dialog.sendQuestion('Do you want to remove this bid?');
      this.clickedIndex = index;
      this.buttonId = 0;
    }
  }

  public confirmBid(index: number) {
    if (index >= 0 && index < this.data.length) {
      this.dialog.sendQuestion('The provider completed the work?');
      this.clickedIndex = index;
      this.buttonId = 1;
    }
  }

  public onClickBid(index: number) {
    if (index >= 0 && index < this.data.length) {
      this.router.navigate([ROUTES.DETAIL + (this.data[index].sid) + '/' + (this.data[index].type ? 1 : 0) + '/' + 1]);
    }
  }

  public onClickSendMoney(index: number) {
    if (index >= 0 && index < this.data.length) {
      this.bidService.sendPayment(this.data[index].bid).subscribe(() => {
        this.data[index].paymentState = 4;
        this.dialog.sendMessage('The money transferred');
      }, error => {
        this.dialog.notifyError(error);
      });
    }
  }
  public convertNumberToDateTime(millis: number): string {
    let date: Date = new Date(millis);
    let t: string[] = date.toDateString().split(" ");
    return date.getFullYear() + ' ' + t[1] + ' ' + t[2] + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  }

  public onClickDescription(description: string){
    this.dialog.sendMessage(description);
  }
  public getDescription(description: string): string{
    if(description != null){
        return description.length < 30?  description : description.substr(0, 27) + '...';
    }
    return '';
  }
}

