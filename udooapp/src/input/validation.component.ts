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
    this.inputs.push(false);
    return this.inputs.length - 1;
  }

  public checkInputValidation(id : number,text : string, type : string) : string{
    switch(type){
      case 'email':
          this.inputs[id] = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(text);
          return this.inputs[id] ? '' : text.length > 0 ? 'Email address most be contain \'@\' and \'.\'' : 'Mandatory';
      case 'password':
          this.inputs[id] = text.length >= 8;
          return this.inputs[id] ? '' :  text.length > 0 ? 'Password is to short' : 'Mandatory';
      case 'phone':
        this.inputs[id] = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(text);
        return this.inputs[id] ? '' : text.length > 0 ? 'Invalid phone number format' : 'Mandatory';
      case 'number':
        this.inputs[id] = /^[0-9]*$/im.test(text);
        return this.inputs[id] ? '' : text.length > 0 ? 'It is not a number' : 'Mandatory';
      case 'text':
        this.inputs[id] = text.length > 0;
        return this.inputs[id] ? '' : text.length > 0 ? 'Most be complete' : 'Mandatory';
      case 'time':
        this.inputs[id] = text.length > 0;
        return this.inputs[id] ? '' : text.length > 0 ? 'Most be complete' : 'Mandatory';
      case 'date':
        this.inputs[id] = text.length > 0;
        return this.inputs[id] ? '' : text.length > 0 ? 'Most be select' : 'Mandatory';
      default:
        this.inputs[id] = text.length > 0;
        return this.inputs[id] ? '' : text.length > 0 ? 'Most be complete' : 'Mandatory';
    }
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
