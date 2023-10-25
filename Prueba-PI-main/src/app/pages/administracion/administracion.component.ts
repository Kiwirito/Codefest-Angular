import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

//interface de usuarios
interface Users{
  username: string;
  email: string;
  name: string;
  last_name: string;
  is_active: boolean;
}

interface Users2{
  user_id: number;
  id: number;
  request: boolean;
}

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})

export class AdministracionComponent implements OnInit{

  users: Users[] = [];

  users2: Users2[] = [];

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getUsers();
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }

  getUsers(): void {
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
    }

    const cartEndpoint ='https://api.thenexusbattles2.cloud/ldap/api/getUsers/?page=1'
    //const cartEndpoint = 'http://127.0.0.1:8000/api/getUsers/?page=1';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    this.http.get<{results:Users[]}>(cartEndpoint,{ headers }).subscribe(
        (data) => {
            this.users = data.results
            console.log('Respuesta de la API:', data.results);
        },
        (error) => {
            console.error('Error al obtener los usuarios:', error);
        }
    );
  }

  changeActiveUser(user: string): void{
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
    }

    const cartEndpoint ='https://api.thenexusbattles2.cloud/ldap/api/banUser/'
    //const cartEndpoint = 'http://127.0.0.1:8000/api/banUser/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    const requestData = { user:user };

      this.http.post(cartEndpoint, requestData, { headers }).subscribe(
          (response: any) => {
              // Manejar la respuesta del servicio de carrito si es necesario
              console.log('Ban response:', response);
          },
          (error) => {
              console.error('Error baned user:', error);
          }
      );
  }

}
