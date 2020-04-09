import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  form: FormGroup;
  formData: string;
  constructor(private fb: FormBuilder) {}
  @Output() submitedtransfer: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit() {
     this.form = this.fb.group({
            accountfrom: ['', Validators.required],
            accountto: ['', Validators.required],
            amount: ['', Validators.required]
     });
  }
  onSubmit(form) {
      this.submitedtransfer.emit(form);
      this.form.reset();
  }
}