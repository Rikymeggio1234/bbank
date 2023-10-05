import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { BankService, Transactions } from 'src/app/services/bank.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';

@Component({
  selector: 'app-bonifico',
  templateUrl: './bonifico.component.html',
  styleUrls: ['./bonifico.component.css']
})
export class BonificoComponent {
  bonificoForm = this.fb.group({
    iban: new FormControl('', [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  constructor(private bankService: BankService,
              private fb: FormBuilder,
              private toastsMessagesService: ToastsMessagesService,
              private router: Router){
  }

  bonifico() {
    if (this.bonificoForm.valid) {
      const { iban, amount, description } = this.bonificoForm.value;
      this.bankService.bonifico(iban!, amount!, description!)
        .subscribe(
          (value) => {
            this.toastsMessagesService.showSuccess(`Bonifico inviato con successo all'iban ${iban}!`)
            this.router.navigate(['/home'])
          },
          (error: HttpErrorResponse) => {
            let message = 'Errore generico, per favore riprova più tardi';
            if(error.status === 400) message = "IBAN non corretto";
            this.toastsMessagesService.showError(message);
          }
        );
    }
  }
}
