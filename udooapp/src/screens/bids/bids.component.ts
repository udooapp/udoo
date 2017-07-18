import {Component, OnInit} from '@angular/core';
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BidService} from "../../services/bid.service";
import {DETAIL} from "../../app/app.routing.module";

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

  constructor(private bidService: BidService, private dialog: DialogController, private notifier: NotifierController, private route: ActivatedRoute, private router: Router) {
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
      let length = this.data.length;
      let lastId = length > 0 ? this.data[length - 1].sid : -1;
      this.bidService.getBids(length, lastId).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          if (data.length < 5) {
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
        if (data.length < 5) {
          this.noMore = true;
        }
      },
      error => {
        this.loading = false;
        this.error = <any>error;
        this.dialog.notifyError(this.error)
      });
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  getTitle(): string {
    return "Accepted Offers";
  }

  getStatus(status: number) {
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
  getColor(status: number) {
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

  cancelBid(index: number) {
    if (index > 0 && index < this.data.length) {
      this.bidService.cancelBid(this.data[index].bid).subscribe(() => {
        this.data.splice(this.index, 1)
      }, error => {
        this.dialog.notifyError(error);
      });
    }
  }

  confirmBid(index: number) {
    if (index >= 0 && index < this.data.length) {
      this.bidService.confirmBid(this.data[index].bid).subscribe(() => {
        this.data[index].status = 2
      }, error => {
        this.dialog.notifyError(error);
      });
    }
  }
  onClickBid(index: number){
    if (index >= 0 && index < this.data.length) {
      this.router.navigate([DETAIL + (this.data[index].sid) + '/' + (this.data[index].type ? 0 : 1) + '/' + 1]);
    }

  }
  onClickSendMoney(index:number){
    if (index >= 0 && index < this.data.length) {
      this.bidService.sendPayment(this.data[index].bid).subscribe(() => {
        this.data.splice(this.index, 1)
      }, error => {
        this.dialog.notifyError(error);
      });
    }
  }
}

