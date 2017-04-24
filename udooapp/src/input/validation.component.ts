import {Component} from '@angular/core';


@Component({
  selector: 'validation'
})
export class ValidationComponent {
  error = false;
  inputs : boolean[] = [];
  errorId: number;
  constructor() {
    this.errorId = -1;
  }

  public add() : number{
    return this.inputs.push(false);
  }

  public checkInputValidation(id : number,text : string, type : string) : string{
    switch(type){
      case 'email':
          this.inputs[id] = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(text);
          return this.inputs[id] ? '' : 'Email adress most be contain \'@\' and \'.\'';
      case 'password':
          this.inputs[id] = text.length >= 8;
          return this.inputs[id] ? '' : 'Password is to short';
      case 'phone':
        this.inputs[id] = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(text);
        return this.inputs[id] ? '' : 'Invalid phone number format';
      case 'number':
        this.inputs[id] = /^[0-9]*$/im.test(text);
        return this.inputs[id] ? '' : 'It is not a number';
    }
    return '';
  }
  public checkValidation(): boolean {

    for(let i = 1; i <= this.inputs.length; i++){
      if(!this.inputs[i] && this.inputs[i] != null){
        this.errorId = i;
        return false
      }
    }
    this.errorId = -1;
    return true;
  }
}
