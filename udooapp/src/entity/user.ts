export class User {
  constructor(public id: number,
              public name: string,
              public email: string,
              public phone: string,
              public picture: string,
              public password: string,
              public type: number,
              public birthdate: string) {
  }

  toString() {
    return '{"id" : "' + this.id + '",' +
      '"name" : "' + this.name + '",' +
      '"email" : "' + this.email + '",' +
      '"password" : "' + this.password + '",' +
      '"phone" : "' + this.phone + '",' +
      '"type" : "' + this.type + '",' +
      '"birthdate" : "' + this.birthdate + '",' +
      '"picture" : "' + this.picture + '"}';
  }
}
