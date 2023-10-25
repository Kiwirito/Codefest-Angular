import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../../shared/services/modal.service';
import { ModalEjemploService } from 'src/app/shared/services/modal-ejemplo.service';


// Importa jQuery y Select2
declare var $: any;

@Component({
  selector: 'signup-component',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})


export class SignupPageComponent implements OnInit {
  errorMessages = {
    username: [
      { type: 'required', message: 'Username is required' },
    ],
    name: [
      { type: 'required', message: 'Name is required' },
    ],
    last_name: [
      { type: 'required', message: 'Last name is required' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'invalidPassword', message: 'Invalid password format' },
    ],
    question: [
      { type: 'required', message: 'Security question is required' },
    ],
    answer: [
      { type: 'required', message: 'Answer is required' },
    ],
  };

  registerForm: FormGroup;


  // Control para los avaters
  hide = true;

  // Controlador para seleccionar preguntas
  selectedQuestion: boolean = false;

  // Controlar proceso del registro
  isSubmitting = false;

  @ViewChild('modalEjemplo') modalTemplate!: TemplateRef<any>;

  securityQuestions = [
    { value: 'mother', label: '¿Cómo se llama tu madre?' },
    { value: 'father', label: '¿Cómo se llama tu padre?' },
    { value: 'siblings', label: '¿Cuántos hermanos tienes?' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private modalService: ModalService, private modalServiceEjemplo: ModalEjemploService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.required,
        this.passwordValidator // Agregar la validación personalizada aquí
      ])],
      answer: ['', Validators.required],
      question: ['', Validators.required],
      checkterms: ['', Validators.required],
    });

  }

  openModal(modalTemplate:TemplateRef<any>){
    this.modalService.open(modalTemplate, {size: 'lg', title:'Términos y Condiciones The Nexus Battles II'})
    .subscribe((action) => {
      console.log('ModalAction', action)
    })
  }

  openModalEjemplo(modalEjemplo:TemplateRef<any>){
    this.modalServiceEjemplo.open(modalEjemplo, {size: 'lg', title:''})
    .subscribe((action) => {
      console.log('ModalAction', action)
    })
  }

  mostrarMensaje() {
    console.log('Funcionando');
  }

  getErrorMessage(fieldName: string) {
    const control = this.registerForm.get(fieldName);

    if (control?.hasError('required')) {
      if (fieldName == "email") {
        return `Correo es obligatorio`;
      }
      if (fieldName == "name") {
        return `Nombre es obligatorio`;
      }
      if (fieldName == "last_name") {
        return `Apellido es obligatorio`;
      }
      if (fieldName == "password") {
        return `Contraseña es obligatoria`;
      }
      if (fieldName == "img") {
        return `Debes escoger un avatar obligatorio`;
      }
      if (fieldName == "username") {
        return `Debes eligir un nickname obligatorio`;
      }
      if (fieldName == "question") {
        return `Tienes que eligir una pregunta de seguridad`;
      }
      if (fieldName == "answer") {
        if (!control?.hasError('question')) {
          return `Tienes que responder la pregunta`;
        }
      }
      else
      {
        return `${fieldName} es obligatorio`;
      }
    }

    if (control?.hasError('email')) {
      return 'Formato invalido de correo';
    }

    if (control?.hasError('invalidPassword')) {
      return 'La contraseña debe contener al menos una mayúscula, una minúscula, un número, un símbolo y ser mayor a 8 caracteres.';
    }

    return '';

  }

  getErrorMessageSelect(fieldName: string) {
    const control = this.registerForm.get(fieldName);

    if (fieldName === 'question') {
      this.selectedQuestion = !!control?.value; // true si se selecciona una pregunta, false de lo contrario
    }

    // Resto de tu lógica de manejo de errores aquí
  }



  // Validación personalizada de contraseña
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control || !control.value) {
      return null; // No hay valor para validar, retorna nulo
    }
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
    const isLengthValid = password.length >= 8;

    if (isLengthValid && hasUpperCase && hasLowerCase && hasNumber && hasSymbol) {
      return null; // La contraseña es válida
    } else {
      return { invalidPassword: true }; // La contraseña no cumple con los criterios
    }
  }


  ngOnInit(): void {


  }


  resetForm() {
    this.registerForm.reset();
    this.isSubmitting = false;

  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;

      const formData = this.registerForm.value;



      const registerData = {
        username: formData.username,
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        img: formData.img,
        password: formData.password,
        question: formData.question,
        answer: formData.answer
      };

      // Guardar los datos en localStorage
      const existingData = JSON.parse(localStorage.getItem('user_data')!) || [];
      existingData.push(registerData);
      localStorage.setItem('user_data', JSON.stringify(existingData));

      // Abre el modal de confirmacion
      this.openModalEjemplo(this.modalTemplate);
      
    }
  }
}
