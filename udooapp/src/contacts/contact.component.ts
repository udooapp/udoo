import {Component, OnInit} from '@angular/core';
import {Offer} from "../entity/offer";
import {OfferService} from "../services/offer.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {ContactService} from "../services/contact.service";
import {User} from "../entity/user";

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ContactService]
})
export class ContactsComponent implements OnInit {
  data: User[];
  offer = true;
  error: string;
  message: string = '';

  constructor(private contactService: ContactService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.contactService.getContacts().subscribe(
      data => this.data = data,
      error => this.error = <any>error);
  }

  getPictureUrl(url: string) {
    if (url == null || url.length == 0 || url === 'null') {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:8090/rest/image/' + url);
  }

  onClickDelete(id: number, index: number) {
    console.log("Deleted:" + id);
    this.contactService.removeContact(id).subscribe(
      result => {
        this.message = result;
        this.data.splice(index, 1)
      },
      error => this.error = <any>error
    );
  }
}

