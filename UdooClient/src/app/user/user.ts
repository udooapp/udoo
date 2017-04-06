export class User {
  constructor(public id: number,
              public name: string,
              public email: string,
              public phone: string,
              public picture: string,
              public password: string) {
  }

  toString() {
    return '{"id" : "' + this.id + '",' +
      '"name" : "' + this.name + '",' +
      '"email" : "' + this.email + '",' +
      '"password" : "' + this.password + '",' +
      '"phone" : "' + this.phone + '",' +
      '"picture" : "' + this.picture + '"}';
  }
}
