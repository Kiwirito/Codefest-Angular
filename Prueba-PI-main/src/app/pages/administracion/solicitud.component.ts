import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface Users2{
  user: number;
  id: number;
  request: boolean;
}

@Component({
  selector: 'app-administracion',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./administracion.component.css']
})

export class SolicitudComponent implements OnInit{

  users2: Users2[] = [];

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
  ){}

  ngOnInit(): void {
    this.getRequest();
  }

  getRequest(): void {
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
    }

    const cartEndpoint ='https://api.thenexusbattles2.cloud/ldap/api/getrequests/'
    //const cartEndpoint = 'http://127.0.0.1:8000/api/getrequests/';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    this.http.get<Users2[]>(cartEndpoint,{ headers }).subscribe(
        (data: Users2[]) => {
            console.log(data)
            this.users2 = data
            console.log('Respuesta de la API:', data);
        },
        (error) => {
            console.error('Error al obtener las solicitudes:', error);
        }
    );
  }

}
