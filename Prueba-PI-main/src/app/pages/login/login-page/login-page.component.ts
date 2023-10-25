import {Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ModalEjemploService } from 'src/app/shared/services/modal-ejemplo.service';



//componentes que se utilizaran como templates y estilos
@Component({
    selector: 'app-login',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})


//creamos el componente del login
export class LoginPageComponent implements OnInit{

    //definimos el formulario
    public loginForm: FormGroup;

    //Definimos el error custom
    showCustomError: boolean = false;

    @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;


    //este constructor define los metodos a usar
    constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private cookieService: CookieService,  private modalServiceEjemplo: ModalEjemploService){
        //inicializamos el formulario
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['',Validators.required]
        })
    }


    openModalEjemplo(modalEjemplo:TemplateRef<any>){
        this.modalServiceEjemplo.open(modalEjemplo, {size: 'lg', title:''})
        .subscribe((action) => {
          console.log('ModalAction', action)
        })
      }

    showSavedData() {
      const userData = JSON.parse(localStorage.getItem('user_data')!);
      if (userData) {
        console.log('Datos guardados:', userData);
      }
    }


    getErrorMessage() {
      const control = this.loginForm.get("username");

      if (this.showCustomError) {
        if (control?.hasError('required')) {
          return `Puede que tu nombre de usuario o contraseña sean incorrectos. Por favor, asegúrese de que ha ingresado la información adecuada en los campos correspondientes.`;
        }
      }
      return '';
    }


    ngOnInit(): void {}


    onSubmit() {
      if (this.loginForm.valid) {
        // Obtenemos los datos del formulario
        const formData = this.loginForm.value;

        // Obtenemos la información almacenada localmente
        const savedUserData = JSON.parse(localStorage.getItem('user_data')!);



        //este es el encabezado de la peticion
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });


        const loginData = {
          username: formData.username,
          password: formData.password
        };

        console.log("Usuarios: ", formData.username);
        console.log("Contraseñas: ", formData.password);
        console.log(loginData);


        if (savedUserData) {
          // Realizamos un ciclo a través de los usuarios almacenados
          for (const user of savedUserData) {
            if (
              formData.username === user.username &&
              formData.password === user.password
            ) {


              // Los datos coinciden, el usuario puede iniciar sesión
              console.log('Inicio de sesión exitoso');


                    //redirigir al usuario
                    this.router.navigate(['/inicio']);

                    //Modal Confirmacion
                    this.openModalEjemplo(this.modalTemplate);

                    return;





            }
          }
        }

        // Si llegamos a este punto, no se encontraron coincidencias
        // Muestra un mensaje de error
        console.log('Nombre de usuario o contraseña incorrectos');

        this.loginForm.reset();

        // Puedes mostrar un mensaje de error en tu interfaz de usuario
        this.showCustomError = true;



      }
    }

}
