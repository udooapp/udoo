import {Component, OnInit} from '@angular/core';
import {RequestService} from "../services/request.service";
import {Request} from "../entity/request";
import {MapService} from "../services/map.service";

@Component({
  templateUrl: '../layouts/lists.component.html',
  styleUrls: ['../layouts/lists.component.css'],
  providers: [RequestService, MapService]
})
export class RequestComponent implements OnInit {
  data: Request[];
  offer = false;
  error: string;
  categories: any[] = [];

  constructor(private requestService: RequestService, private mapService: MapService) {
  }

  ngOnInit() {
    this.mapService.getCategories().subscribe(
      data => {
        this.categories = data;
        this.categories.splice(0, 0, {cid: 0, name: 'Select category'})
      },
      error => this.error = <any>error
    );
    this.requestService.getUserRequest(1).subscribe(
      data => this.data = data,
      error => this.error = <any>error);

  }

  getCategory(category: number): string {
    let cat = this.categories.find(cat => cat.cid == category);
    return cat.name ? cat.name : 'Category is not exist!';
  }

}
