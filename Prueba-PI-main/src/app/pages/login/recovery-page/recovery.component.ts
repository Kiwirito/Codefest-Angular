import { Component,OnInit } from '@angular/core';



@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})

export class RecoveryComponent implements OnInit{

  selectedQuestion: boolean = false;
  securityQuestions = [
    { value: 'mother', label: '¿Cómo se llama tu madre?' },
    { value: 'father', label: '¿Cómo se llama tu padre?' },
    { value: 'siblings', label: '¿Cuántos hermanos tienes?' }
  ];

  constructor(

  ){}

  ngOnInit(): void {

  }



}
