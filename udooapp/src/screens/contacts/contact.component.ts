import {Component, OnInit} from '@angular/core';
import {ContactService} from "../../services/contact.service";
import {User} from "../../entity/user";
import {DialogController} from "../../controllers/dialog.controller";
import {NotifierController} from "../../controllers/notify.controller";

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  data: User[];
  error: string;
  message: string = '';
  deleteClick: boolean = false;
  index: number = 0;
  id: number = 0;
  loading: boolean = false;
  noMore: boolean = false;

  constructor(private contactService: ContactService, private dialog: DialogController, private notifier: NotifierController) {
    dialog.errorResponse$.subscribe(() => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    notifier.userScrolledToTheBottom$.subscribe(() => {
      this.userScrollDown();
    });
    dialog.questionResponse$.subscribe(response => {
      if (response && this.deleteClick) {
        this.contactService.removeContact(this.id).subscribe(
          result => {
            this.message = result;
            this.data.splice(this.index, 1)
          },
          error => this.error = <any>error
        );
        this.deleteClick = false;
      }
    });
  }
  private userScrollDown() {
    if (!this.loading && !this.noMore) {
      this.loading = true;
      let length = this.data.length;
      let lastId = length > 0 ? this.data[length - 1].uid : -1;
      this.contactService.getContacts(length, lastId).subscribe(
        data => {
          for (let i = 0; i < data.length; ++i) {
            this.data.push(data[i]);
          }
          if(data.length < 5){
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
    this.contactService.getContacts(0, -1).subscribe(
      data => {
        this.loading = false;
        this.data = data;
        if(data.length < 5){
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

  onClickDelete(id: number, index: number) {
    this.id = id;
    this.index = index;
    this.dialog.sendQuestion('Do you want to delete ' + this.data[index].name + '?');
    this.deleteClick = true;
  }
}

