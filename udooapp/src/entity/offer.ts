export class Offer {

  constructor(public oid: number,
              public title: string,
              public description: string,
              public category: number,
              public uid: number,
              public location: string,
              public availability: string,
              public expirydate: number,
              public realTime: boolean,
              public picturesOffer: any[]) {
  }

  toString(): string {
    return '{ "oid" : "' + this.oid + '",' +
      '"title" : "' + this.title + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"availability" : "' + this.availability + '",' +
      '"expirydate" : "' + this.expirydate + ',' +
      '"realTime" : ' + this.realTime + '}';
  }
}
