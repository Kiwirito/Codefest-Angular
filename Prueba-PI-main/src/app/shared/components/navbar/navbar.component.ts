import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { ProductsPageComponent } from 'src/app/products/pages/home/home-page.component';
import { CarritoService } from '../../../products/carrito-servicio.component';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

//interface de la carta
interface Carta {
  id_carta: string;
  nombre_carta: string;
  urlImagen: string;
  price: number;
  quantity: number;
}


@Component({
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy  {

  title = 'custom icons';
  cantidadProductosEnCarrito: number = 0;

  searchKeyword: string = '';

  usuarioHaIniciadoSesion: boolean = false;
  nombreUsuario: string = '';
  cartas: Carta[] = [];
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;
  private carritoSubscription!: Subscription;


  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private carritoService: CarritoService,
    private cookieService: CookieService,
    private router: Router


    //private websocketService: WebsocketService
  ) {
    this.matIconRegistry.addSvgIcon(
      'carrito',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/shopping_cart.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'jugar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/game.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'banco',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/bank.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'torneo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/torneo.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'subasta',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/subasta.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'micuenta',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/cuenta.svg'),
    )

    this.matIconRegistry.addSvgIcon(
      'trash',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/trash.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'star',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/stars.svg'),
    );
    this.cartas = []
  }

  ngOnInit() {
    // Obtener la cantidad inicial de productos en el carrito
    this.cantidadProductosEnCarrito = this.carritoService.obtenerCantidadProductosEnCarrito();

    // Suscribirse a los cambios en la cantidad de productos en el carrito
    this.carritoSubscription = this.carritoService.cantidadProductosEnCarrito$.subscribe(
      (cantidad) => {
        this.cantidadProductosEnCarrito = cantidad;
      }
    );

    // Comprobar si existe un token de acceso en el localStorage
    const token = this.cookieService.get('access_token');
    const username = localStorage.getItem('username')

    if (token) {
      this.nombreUsuario = username || '';
      this.usuarioHaIniciadoSesion = true;
    };

    this.getCartas();
    this.calcular();
    /*8
    this.websocketService.listen('cartUpdated').subscribe((data: Carta[] | Carta) => {
      if (Array.isArray(data)) {
        this.cartas = data;
      } else {
        this.cartas = [data]
      }

    });*/
  }

  search(){
    this.router.navigate(['/search'],{
      queryParams: {keyword: this.searchKeyword}
    })
  }

  ngOnDestroy() {
    // Asegurarse de desuscribirse para evitar fugas de memoria
    this.carritoSubscription.unsubscribe();
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

  calcular(): void{
    this.subtotal = this.cartas.reduce((acc,carta) => acc + carta.price, 0);
    this.iva = this.subtotal*0.19;
    this.total = this.iva+this.subtotal;
  }


}
