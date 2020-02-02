import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true;
  isLoading = false;
  error = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy() {
    if (this.closeSub) this.closeSub.unsubscribe();
    if (this.storeSub) this.storeSub.unsubscribe();
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

    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignUpStart({ email: email, password: password })
      )
    }
    form.reset();
  }

  handleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  // private showErrorAlert(message: string) {
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
  //     AlertComponent
  //   );
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
  //
  //   componentRef.instance.message = message;
  //   this.closeSub = componentRef.instance.close.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   });
  // }

}
