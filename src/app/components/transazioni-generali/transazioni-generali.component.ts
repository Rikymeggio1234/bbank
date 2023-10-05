import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BankService } from 'src/app/services/bank.service';
import { ToastsMessagesService } from 'src/app/services/toasts-messages.service';

@Component({
  selector: 'app-transazioni-generali',
  templateUrl: './transazioni-generali.component.html',
  styleUrls: ['./transazioni-generali.component.css']
})
export class TransazioniGeneraliComponent {
  categoryid = [
    {
      category: "Pagamento Utenze",
      id: "650d865bff8d876d587ff468"
    },
    {
      category: "Versamento Bancomat",
      id: "650d86baff8d876d587ff46c"
    },
    {
      category: "Prelievo Contanti",
      id: "6513efa173766e8ac7e52570"
    }
  ]
  
  transazioneForm = this.fb.group({
    amount: new FormControl(null, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    categoryid: new FormControl(this.categoryid[0].id, [Validators.required]),
  })

  constructor(private bankService: BankService,
              private fb: FormBuilder,
              private toastsMessagesService: ToastsMessagesService,
              private router: Router){
  }

  bonifico() {
    if (this.transazioneForm.valid) {
      const { amount, description, categoryid } = this.transazioneForm.value;
      this.bankService.transazioneGenerale(amount!, description!, categoryid!)
        .subscribe(
          (value) => {
            this.toastsMessagesService.showSuccess(`Transazione eseguita con successo!`)
            this.router.navigate(['/home'])
          },
          (error: HttpErrorResponse) => {
            let message = 'Errore generico, per favore riprova più tardi';
            this.toastsMessagesService.showError(message);
          }
        );
    }
  }
}
