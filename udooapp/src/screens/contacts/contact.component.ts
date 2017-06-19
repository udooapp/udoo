import {Component, OnInit} from '@angular/core';
import {ContactService} from "../../services/contact.service";
import {User} from "../../entity/user";
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

  constructor(private contactService: ContactService, private notifier: NotifierController) {
    notifier.tryAgain$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe(
      data => this.data = data,
      error => {
        this.error = <any>error;
        this.notifier.notifyError(this.error)
      });
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return url;
  }

  onClickDelete(id: number, index: number) {
    this.contactService.removeContact(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => this.error = <any>error
    );
  }
}

