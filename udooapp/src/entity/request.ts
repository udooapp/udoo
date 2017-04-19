export class Request {

  constructor(public rid: number,
              public title: string,
              public description: string,
              public category: string,
              public uid: number,
              public location: string,
              public jobdate: string,
              public expridate: string,
              public picture: string) {
  }

  toString(): string {
    return '{"rid" : "' + this.rid + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"title" : "' + this.title + '",' +
      '"picture" : "' + this.picture + '",' +
      '"jobdate" : "' + this.jobdate + '",' +
      '"expridate" : "' + this.expridate + '"}';

  }
}
