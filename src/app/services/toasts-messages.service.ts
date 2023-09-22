import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastsMessagesService {
  constructor(private messageService: MessageService) {}

  showSuccess(message: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showInfo(message: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showWarn(message: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: message });
  }

  showError(message: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}