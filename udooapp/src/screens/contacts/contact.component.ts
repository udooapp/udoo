import {Component, OnInit} from '@angular/core';
import {ContactService} from "../../services/contact.service";
import {User} from "../../entity/user";
import {DialogController} from "../../controllers/dialog.controller";

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  data: User[];
  error: string;
  message: string = '';
  delete: boolean = false;
  index: number = 0;
  id: number = 0;

  constructor(private contactService: ContactService, private dialog: DialogController) {
    dialog.errorResponse$.subscribe(tryAgain => {
      if (this.error.length > 0) {
        this.ngOnInit();
      }
    });
    dialog.questionResponse$.subscribe(response => {
      if(response && this.delete){
        this.contactService.removeContact(this.id).subscribe(
          result => {
            this.message = result;
            this.data.splice(this.index, 1)
          },
          error => this.error = <any>error
        );
        this.delete = false;
      }
    });
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe(
      data => this.data = data,
      error => {
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
    this.delete = true;
  }
}

