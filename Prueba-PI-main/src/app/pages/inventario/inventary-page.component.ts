import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal/public_api';
import VanillaTilt from 'vanilla-tilt';
import { CookieService } from 'ngx-cookie-service';

//interface de la carta
interface Inventary {
    user: string;
    id_carta: string;
    carta: Carta;
}

interface Carta {
  _id: string;
  estado: boolean;
  imagen: string;
  precio: number;
  stock: number;
  nombre: string;
  poder: string,
  vida:number,
  defensa:number,
  ataqueBase: number,
  dano: number,
  coleccion: string,
  descripcion: string
}

@Component({
    selector: 'app-inventary',
    templateUrl: './inventary-page.component.html',
    styleUrls: ['./inventary-page.component.css']

})

export class InventaryPageComponent implements OnInit, AfterViewChecked {

    inventario: Inventary[] = [];

    // Variables Carrusel
    imagenActualIndex: number = 0;
    cartasAMostrar: number = 4;
    displayedImages: Inventary[] = [];

    constructor(private http: HttpClient,
      private matIconRegistry: MatIconRegistry,
      private cookieService: CookieService,
      private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
          'flecha_derecha',
          this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/nav_right.svg')
        )
        this.matIconRegistry.addSvgIcon(
          'flecha_izquierda',
          this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/nav_left.svg')
        )

        this.inventario = [];
        this.updateDisplayedImages();
    }

    ngOnInit(): void {
        this.getInventary();
    }

    ngAfterViewChecked(){
      const elementosCarta = document.querySelectorAll('[data-tilt]');
      if (elementosCarta.length > 0) {
        elementosCarta.forEach((elemento: any) => {
          // Aplicar VanillaTilt a cada elemento
          VanillaTilt.init(elemento, {
            max: 10,
            speed: 500,
            perspective: 1000,
            scale: 1.1,
            transition: true,
            gyroscope: true,
          });
        });
      }
    }

    prevImage(): void {
      const prevIndex = (this.imagenActualIndex - 1 + this.inventario.length) % this.inventario.length;
      this.imagenActualIndex = prevIndex;
      this.updateDisplayedImages();
    }

    nextImage(): void {
      const nextIndex = (this.imagenActualIndex + 1) % this.inventario.length;
      this.imagenActualIndex = nextIndex;
      this.updateDisplayedImages();
    }

    isLastPage(): boolean {
      return this.imagenActualIndex + this.cartasAMostrar >= this.inventario.length;
    }

    private updateDisplayedImages(): void {
      const numCartas = this.inventario.length;
      const displayedImages: Inventary[] = [];

      for (let i = 0; i < this.cartasAMostrar; i++) {
        const index = (this.imagenActualIndex + i) % numCartas;
        displayedImages.push(this.inventario[index]);
      }

      this.displayedImages = displayedImages;
    }


    getInventary(): void {
      const accessToken = this.cookieService.get('access_token');

      if (!accessToken) {
          console.error('No se ha encontrado el token de acceso.');
          return;
      }

      const cartEndpoint ='https://webserver.thenexusbattles2.cloud/ver-inventario'
      //const cartEndpoint = 'http://localhost:3000/ver-inventario';
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      });

      this.http.get<Inventary[]>(cartEndpoint,{ headers }).subscribe(
          (data: Inventary[]) => {
              this.inventario = data
              console.log('Respuesta de la API:', data);
              this.getCards();
          },
          (error) => {
              console.error('Error al obtener el inventario1:', error);
          }
      );
  }

    getCards(): void {
      for (const item of this.inventario){
          const id_carta = item.id_carta
          const cartEndpoint =`https://cards.thenexusbattles2.cloud/api/cartas/${id_carta}`;
          //const cartEndpoint = `http://127.0.0.1:8000/api/cardDetail/${id_carta}`;
          const headers = new HttpHeaders({
              'Content-Type': 'application/json',
          });

          this.http.get<Carta>(cartEndpoint,{ headers }).subscribe(
              (carta: Carta) => {
                  item.carta = carta
                  console.log('Respuesta de la API:', carta);
              },
              (error) => {
                  console.error('Error al obtener el inventario2:', error);
              }
          );
      }

  }
}
