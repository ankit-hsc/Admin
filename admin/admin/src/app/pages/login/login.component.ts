import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service'

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form: FormGroup;
  public name: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public response: boolean = true;
  public status: number;
  public token: string;
  errorText: string = '';

  constructor(fb: FormBuilder, private router: Router, private loginService: LoginService) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.name = this.form.controls['name'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values):void {
    this.submitted = true;
    this.router.navigate(['pages']);
    if (this.form.valid) {
      
      this.loginService.login(values.name, values.password).subscribe((response) => {
        console.log(response);
        this.errorText = '';
        this.token = 'Bearer ' + response.data;
        localStorage.setItem("jwtToken",this.token);
        this.status = response.status;
        if (this.status == 1 && this.token!= null) {
          this.router.navigate(['pages']);
        }
        else {
          alert("Login failed");
        }
      }, err => {
        console.log(err);
        if (err.status == 401) {
          this.errorText = 'Invalid Credentials';
        } else {
          this.errorText = 'Internal Server Error';
        }
      })

    }
  }
}
