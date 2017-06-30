export class User {
  constructor(public uid: number,
              public name: string,
              public email: string,
              public phone: string,
              public picture: string,
              public password: string,
              public stars: number,
              public type: number,
              public birthdate: string,
              public language: string,
              public active: number,
              public socialID: number) {
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
    this.stars = user.stars;
    this.language = user.language;
    this.active = user.active;
  }

  toString() {
    return '{"uid" : "' + this.uid + '",' +
      '"name" : "' + this.name + '",' +
      '"email" : "' + this.email + '",' +
      '"password" : "' + this.password + '",' +
      '"phone" : "' + this.phone + '",' +
      '"stars" : "' + this.stars + '",' +
      '"type" : "' + this.type + '",' +
      '"birthdate" : "' + this.birthdate + '",' +
      '"picture" : "' + this.picture + '",' +
      '"language": "' + this.language + '",' +
      '"active": "'+ this.active + '"}';
  }
}
