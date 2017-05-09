export class Request {

  constructor(public rid: number,
              public title: string,
              public description: string,
              public category: number,
              public uid: number,
              public location: string,
              public jobdate: string,
              public expridate: string,
              public image: string) {
  }

  toString(): string {
    return '{"rid" : "' + this.rid + '",' +
      '"description" : "' + this.description + '",' +
      '"category" : "' + this.category + '",' +
      '"uid" : "' + this.uid + '",' +
      '"location" : "' + this.location + '",' +
      '"title" : "' + this.title + '",' +
      '"image" : "' + this.image + '",' +
      '"jobdate" : "' + this.jobdate + '",' +
      '"expridate" : "' + this.expridate + '"}';

  }
}
