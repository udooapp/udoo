import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../../../services/map.service";
import {Offer} from "../../../entity/offer";
import {Request} from "../../../entity/request";
import {DETAIL} from "../../../app/app.routing.module";
import {ConversionMethods} from "../../layouts/conversion.methods";
import {DialogController} from "../../../controllers/dialog.controller";
import {NotifierController} from "../../../controllers/notify.controller";
import {OfferService} from "../../../services/offer.service";
import {RequestService} from "../../../services/request.service";


@Component({
  selector: 'main-wall',
  templateUrl: './wall.main.component.html',
  styleUrls: ['./wall.main.component.css'],
  providers: []
})
export class MainWallComponent {

  constructor() {

  }



}
