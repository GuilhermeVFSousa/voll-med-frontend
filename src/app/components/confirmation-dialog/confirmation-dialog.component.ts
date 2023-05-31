import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string | null,
      multipleButtons: boolean,
      buttonConfirmation: string | null,
      buttonCancel: string | null,
      singleButtonText: string | null
     },
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  ngOnInit() {
  }

  onCancel(confirmAction: boolean) {
    this.dialogRef.close(confirmAction);
  }

}
