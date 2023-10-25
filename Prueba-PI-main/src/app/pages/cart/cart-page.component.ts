import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router  } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

//interface de la carta
interface Carta {
    id_carta: string;
    activo: boolean;
    imagen: string;
    price: number;
    quantity: number;
    nombre_carta: string;
}


@Component({
    selector: 'app-cart',
    templateUrl: './cart-page.component.html',
    styleUrls: ['./cart-page.component.css']
})


export class CartPageComponent implements OnInit {
    // Guardar cartas
    cartas: Carta[] = [];
    subtotal: number = 0;
    iva: number = 0;
    total: number = 0;
  
    constructor(private cookieService: CookieService,private http: HttpClient, private router: Router ) {
      this.cartas = []
    }
  
    ngOnInit(): void {
      this.getCartas();
      this.calcular();
    }

    // Obtener las cartas del carrito del usuario
    getCartas(): void { 
      // Realizar una solicitud HTTP para agregar la carta al carrito
      const accessToken = this.cookieService.get('access_token');

      if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
      }

      const cartEndpoint ='https://webserver.thenexusbattles2.cloud/obtener-carrito'
      //const cartEndpoint = 'http://localhost:3000/obtener-carrito';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
  
      this.http.get<Carta[]>(cartEndpoint,{ headers }).subscribe(
        (data: Carta[] | Carta) => {
          if (Array.isArray(data)){
            this.cartas = data;
          }else{
            this.cartas = [data]
          }
          this.calcular();
          console.log('Respuesta de la API:', data); // Imprimir la respuesta por consola
        },
        (error) => {
          console.error('Error al obtener el carrito de compras:', error);
        }
      );
    }

    addToCart(id_carta: string, price: number, nombre_carta: string) {
      // Realizar una solicitud HTTP para agregar la carta al carrito
      const accessToken = this.cookieService.get('access_token');
  
      if (!accessToken) {
        console.error('No se ha encontrado el token de acceso.');
        return;
      }

      const cartEndpoint ='https://webserver.thenexusbattles2.cloud/enviar-token'
      //const cartEndpoint = 'http://localhost:3000/enviar-token';
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      });
      const requestData = { id_carta: id_carta, price: price, nombre_carta:nombre_carta };
  
      this.http.post(cartEndpoint, requestData, { headers }).subscribe(
          (response: any) => {
              // Manejar la respuesta del servicio de carrito si es necesario
              console.log('Cart response:', response);
          },
          (error) => {
              console.error('Error adding to cart:', error);
          }
      );
  }

  removeToCart(id_carta: string) {
    // Realizar una solicitud HTTP para agregar la carta al carrito
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
      console.error('No se ha encontrado el token de acceso.');
      return;
    }

    const cartEndpoint ='https://webserver.thenexusbattles2.cloud/remover-carta'
    //const cartEndpoint = 'http://localhost:3000/remover-carta';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });
    const requestData = { id_carta: id_carta};

    this.http.post(cartEndpoint, requestData, { headers }).subscribe(
        (response: any) => {
            // Manejar la respuesta del servicio de carrito si es necesario
            console.log('Cart response:', response);
        },
        (error) => {
            console.error('Error adding to cart:', error);
        }
    );
}

  deleteToCart(id_carta: string) {
    // Realizar una solicitud HTTP para agregar la carta al carrito
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
      console.error('No se ha encontrado el token de acceso.');
      return;
    }

    const cartEndpoint ='https://webserver.thenexusbattles2.cloud/borrar-carta'
    //const cartEndpoint = 'http://localhost:3000/borrar-carta';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });
    const requestData = { id_carta: id_carta};

    this.http.post(cartEndpoint, requestData, { headers }).subscribe(
        (response: any) => {
            // Manejar la respuesta del servicio de carrito si es necesario
            console.log('Cart response:', response);
        },
        (error) => {
            console.error('Error adding to cart:', error);
        }
    );
}

  CreateOrder(){
    // Realizar una solicitud HTTP para crear la orden
    const accessToken = this.cookieService.get('access_token');

    if (!accessToken) {
      console.error('No se ha encontrado el token de acceso.');
      return;
    }

    const cartEndpoint ='https://webserver.thenexusbattles2.cloud/crear-orden'
    const cartEndpoint2 ='https://webserver.thenexusbattles2.cloud/vaciar-carrito'
    //const cartEndpoint2 ='http://localhost:3000/vaciar-carrito'
    //const cartEndpoint = 'http://localhost:3000/crear-orden';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    this.http.post(cartEndpoint,{}, { headers }).subscribe(
      (response: any) => {
          // Manejar la respuesta del servicio de carrito si es necesario
          console.log('Cart response:', response);
          const orderID = response.order.order_id
          this.router.navigate(['/order', orderID]);
          if(response){
            this.http.post(cartEndpoint2,{}, { headers }).subscribe(
              (response: any) => {
                  // Manejar la respuesta del servicio de carrito si es necesario
                  console.log('Cart response:', response);
              },
              (error) => {
                  console.error('Error adding to cart:', error);
              }
          );
          }
      },
      (error) => {
          console.error('Error adding to cart:', error);
      }
  );
}

    calcular(): void{
      this.subtotal = this.cartas.reduce((acc,carta) => acc + (carta.price * carta.quantity), 0);
      this.iva = this.subtotal*0.19;
      this.total = this.iva+this.subtotal;
    }
}
