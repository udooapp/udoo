export class Offer {

  constructor(public oid: number,
              public title: string,
              public description: string,
              public category: string,
              public uid: number,
              public location: string,
              public availability: string,
              public expridate: number) {
  }

  toString(): string {
    return '{ "oid" : "' + this.oid + '",' +
      '"title" : "' + this.title + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"availability" : "' + this.availability + '",' +
      '"expridate" : "' + this.expridate + '"}';
  }
}
