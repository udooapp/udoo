export class Request {

  constructor(public rid: number,
              public title: string,
              public description: string,
              public category: number,
              public uid: number,
              public location: string,
              public jobdate: string,
              public expirydate: number,
              public picturesRequest: any[]) {
  }

  toString(): string {
    return '{"rid" : "' + this.rid + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"title" : "' + this.title + '",' +
      '"jobdate" : "' + this.jobdate + '",' +
      '"expirydate" : "' + this.expirydate + '"}';

  }
}
