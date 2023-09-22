import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';
import { MyErrorStateMatcher } from 'src/assets/utils/default.error-matcher';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm = this.fb.group({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [  	Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*([0-9]|[^A-Za-z0-9])).{8,}$")])
  })

  matcher = new MyErrorStateMatcher();

  hide = true;
  loginError = '';

  togglePasswordVisibility(event: Event){
    event.stopPropagation();
    this.hide = !this.hide;
  }

  private destroyed$ = new Subject<void>();

  constructor(protected fb: FormBuilder,
              private authSrv: AuthService,
              private router: Router,
              private toastsMEssagesService: ToastsMessagesService) { }
              
  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.loginError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  register() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
      this.authSrv.register(firstName!, lastName!, email!, password!)
        .pipe(
          catchError(err => {
            this.loginError = err.error.message;
            return throwError(() => err);   
          })
        )
        .subscribe(
          (value) => {
            this.toastsMEssagesService.showSuccess("Profilo creato con successo!")
            this.router.navigate(['/auth/login'])
          },
          (error: HttpErrorResponse) => {
            let message = 'Errore generico, per favore riprova più tardi';
            if(error.status === 400) message = "Profilo già esistente";
            this.toastsMEssagesService.showInfo(message);
          }
        );
    }
  }

  getErrorMessage() {
    const email = this.registerForm.get('email');
    return email?.invalid && email.value !== '' ? 'Email non valida' : '';
  }

  getPasswordMessage() {
    const password = this.registerForm.get('password');
    let message = "Caratteri: ";

    if(password?.invalid){
      if(password.value!.length < 8){
        message += "minimo 8"
      }

      // Verifica se la password contiene almeno un carattere maiuscolo
      if (!/[A-Z]/.test(password!.value!)) {
        if(message !== "") message += ", ";
        message += "1 maiuscola"
      }

      // Verifica se la password contiene almeno un carattere minuscolo
      if (!/[a-z]/.test(password!.value!)) {
        if(message !== "") message += ", ";
        message += "1 minuscola";
      }

      // Verifica se la password contiene almeno un numero
      if (!/[0-9]/.test(password!.value!) && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password!.value!)) {
        if(message !== "") message += ", ";
        message += "1 speciale o 1 numero";
      }
    }

    return message;
  }
}
