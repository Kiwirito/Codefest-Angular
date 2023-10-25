import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component,OnInit, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ModalEjemploService } from 'src/app/shared/services/modal-ejemplo.service';


//interface de la carta
interface Perfil {
  user: string;
  sub: boolean;
  games: number;
  credits: number;
  name: string;
  last_name: string;
  email: string;
  img: string;
}


@Component({
  selector: 'app-eliminacion',
  templateUrl: './eliminacion.component.html',
  styleUrls: ['./eliminacion.component.css']
})

export class EliminacionComponent implements OnInit{

  perfil: any = {};


  constructor(
    private http: HttpClient,private cookieService: CookieService, private modalServiceEjemplo: ModalEjemploService
  ){}

  ngOnInit(): void {
    this.getUser()
  }


  openModalEjemplo(modalEjemplo:TemplateRef<any>){
    this.modalServiceEjemplo.open(modalEjemplo, {size: 'lg', title:''})
    .subscribe((action) => {
      console.log('ModalAction', action)
    })
  }

  getUser(): void {
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
    }

    const cartEndpoint ='https://webserver.thenexusbattles2.cloud/ver-perfil'
    //const cartEndpoint = 'http://localhost:3000/ver-perfil';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    this.http.get<Perfil>(cartEndpoint,{ headers }).subscribe(
        (data: any) => {
            this.perfil = data
            console.log('Respuesta de la API:', data);
        },
        (error) => {
            console.error('Error al obtener el carrito de compras:', error);
        }
    );
}

  deleteUser(user: string): void{
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
    }
    const cartEndpoint ='https://api.thenexusbattles2.cloud/ldap/api/requests/'
    //const cartEndpoint = 'http://127.0.0.1:8000/api/requests/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    const requestData = { user:user };

      this.http.post(cartEndpoint, requestData, { headers }).subscribe(
          (response: any) => {
              // Manejar la respuesta del servicio de carrito si es necesario
              console.log('delete response:', response);
          },
          (error) => {
              console.error('Error delete user:', error);
          }
      );
  }

}
