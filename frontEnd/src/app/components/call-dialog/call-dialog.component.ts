import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.css']
})
export class CallDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CallDialogComponent>) { }

  ngOnInit(): void {
  }

  hangUp(): void {
    // Add your hang-up logic here
    this.dialogRef.close('refuse');
  }

  createPeerConnection(): void {
    // Add your create peer connection logic here
    this.dialogRef.close('create-peer-connection');
  }

}
