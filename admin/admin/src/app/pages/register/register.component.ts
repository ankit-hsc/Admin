import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EqualPasswordsValidator} from '../../theme/validators';
import {Router} from '@angular/router';
import{RegisterService} from './register.service'
@Component({
  selector: 'register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  public form:FormGroup;
  public name:AbstractControl;
  
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;

  public submitted:boolean = false;
  public response:boolean=true;
  public status:string;

  constructor(fb:FormBuilder,private router:Router,private registerService:RegisterService) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
     
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.name = this.form.controls['name'];
  
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values){
    this.submitted = true;
    console.log(values);
    if (this.form.valid) {
      this.registerService.register(values.name,values.passwords.password).subscribe((data) => {
        this.status=data;
        if(this.status=='Success'){
          this.router.navigate(['pages']);
        }
      }, err => {
        console.log(err);
      })

      
    }
  }
}
