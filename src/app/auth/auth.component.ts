import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const email = form.value.email;
    const password = form.value.password;
    
    if (this.isLoginMode) {
      // ... Impl Login process
    } else {
      this.signUp(email, password);
    }
    form.reset();
  }

  signUp(email: string, password: string) {
    this.authService.signUp(email, password).subscribe(
      (response: AuthResponseData) => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

}
