import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-delete-modal',
  templateUrl: './confirmation-delete-modal.component.html',
  styleUrl: './confirmation-delete-modal.component.css'
})
export class ConfirmationDeleteModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
