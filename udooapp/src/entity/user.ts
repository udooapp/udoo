export class User {
  constructor(public uid: number,
              public name: string,
              public email: string,
              public phone: string,
              public picture: string,
              public password: string,
              public type: number,
              public birthdate: string) {
  }
  refresh(user: User){
    this.uid = user.uid;
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.picture = user.picture;
    this.password = user.password;
    this.type = user.type;
    this.birthdate = user.birthdate;
  }

  toString() {
    return '{"uid" : "' + this.uid + '",' +
      '"name" : "' + this.name + '",' +
      '"email" : "' + this.email + '",' +
      '"password" : "' + this.password + '",' +
      '"phone" : "' + this.phone + '",' +
      '"type" : "' + this.type + '",' +
      '"birthdate" : "' + this.birthdate + '",' +
      '"picture" : "' + this.picture + '"}';
  }
}
