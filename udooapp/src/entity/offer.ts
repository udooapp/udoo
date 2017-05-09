export class Offer {

  constructor(public oid: number,
              public title: string,
              public description: string,
              public category: number,
              public uid: number,
              public location: string,
              public availability: string,
              public expirydate: number,
              public image: string) {
  }

  toString(): string {
    return '{ "oid" : "' + this.oid + '",' +
      '"title" : "' + this.title + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"availability" : "' + this.availability + '",' +
      '"image" : "' + this.image + '",' +
      '"expirydate" : "' + this.expirydate + '"}';
  }
}
