import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error = null;
  @ViewChild(PlaceholderDirective, {static: false})

  constructor(
    private authService: AuthService,
    private route: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.error = null;
    if (form.invalid) return;
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signUp(email, password)
    }
    this.subscribeAuthObs(authObs);
    form.reset();
  }

  subscribeAuthObs(authObs: Observable<AuthResponseData>) {
    authObs.subscribe(
      (response: AuthResponseData) => {
        console.log(response);
        this.isLoading = false;
        this.route.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }

  handleError() {
    this.error = null;
  }

  private showErrorAlert() {
    const alertCmp = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
  }

}
