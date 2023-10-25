import { Component, OnInit,ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import VanillaTilt from 'vanilla-tilt';
import { CookieService } from 'ngx-cookie-service';
import { CarritoService } from 'src/app/products/carrito-servicio.component';


//interface de la carta
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
  descripcion: string,
  descuento: number,
  icono: string
}

declare var navigator: any;

@Component({
  selector: 'app-products-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class ProductsPageComponent  implements OnInit, AfterViewChecked {

  //guardar cartas
  cartas: Carta[] = [];
  botonCarrito = document.getElementById('botonCarrito');
  monedaUsuario: string = 'COP';

  ///paginacion
  public currentPage:number = 1;
  public totalPages:number = 7;
  public totalPagesArray: number[] = [];
  public pagesToShow: number = 5;




  constructor(private http: HttpClient,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cookieService: CookieService,
    private carritoService: CarritoService,
    )  {

    this.matIconRegistry.addSvgIcon(
      'carrito',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/shopping_cart.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'cartas',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/cartaBorde.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'favorito',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/favorite.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'añadir_carrito',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/add_shop.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'add',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/add.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'remove',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/remove.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'trash',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/trash.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'flecha_derecha',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/nav_right.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'flecha_izquierda',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/nav_left.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'personaje',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/personaje.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'items',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/items.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'sword',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/sword.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'armor',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/armor2.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'descuento',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/descuento.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'tanque',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/tanque.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'axe',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/axe.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'magofuego',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/magofuego.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'magohielo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/magohielo.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'picaroveneno',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/picaroveneno.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'picaromachete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/picaromachete.svg')
    )
    this.matIconRegistry.addSvgIcon(
      'indicador_disc',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/indicador_descuento.svg')

    )




  }


  ngOnInit(): void {
    this.generateTotalPagesArray();
    this.getCartasByPage(this.currentPage);
    this.obtenerUbicacionUsuario()
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

  //generar los numeros
  generateTotalPagesArray(): void {
    // Calcula la página central en función del número total de páginas
    const middlePage = Math.ceil(this.pagesToShow / 2);

    // Calcula el inicio y el fin del rango de páginas visibles
    let start = this.currentPage - middlePage + 1;
    let end = this.currentPage + middlePage - 1;

    // Ajusta los valores de inicio y fin según los límites
    if (start < 1) {
      start = 1;
      end = Math.min(this.totalPages, this.pagesToShow);
    } else if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, this.totalPages - this.pagesToShow + 1);
    }

    this.totalPagesArray = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  //obtener las cartas de la API
  getCartasByPage(pageNumber: number): void {
    //const apiUrl = `http://127.0.0.1:8000/api/cards/?page_number=${pageNumber}`;
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=6&page=${pageNumber}&coleccion=All&onlyActives=true`;

    this.http.get(apiUrl).subscribe((data: any) => { // Usamos 'any' para el tipo de la respuesta, ya que no coincide directamente con nuestra interfaz Carta.
      this.cartas = data.map((item: any) => {
        // Mapeamos 'daño' a 'dano' en cada elemento de la respuesta
        return {
          ...item,
          dano: item.daño
        };
      });
    });
    console.log(this.cartas)
  }

  //camiar de pagina
  changePageTo(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.generateTotalPagesArray(); // Actualiza las páginas visibles
      this.getCartasByPage(this.currentPage);
    }
  }

  //Cambiar precio segun ubicacion
  obtenerUbicacionUsuario() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          const latitud = position.coords.latitude;
          const longitud = position.coords.longitude;

          // Verifica las coordenadas para determinar la ubicación del usuario
          if (latitud >= 0 && longitud >= 0) {
            // Usuario en Europa
            this.monedaUsuario = 'EUR';
          } else if (latitud <= 0 && longitud <= 0) {
            // Usuario en Colombia
            this.monedaUsuario = 'USD';
          } else {
            // Usuario en otros lugares (por defecto, Dólares)
            this.monedaUsuario = 'COP';
          }
        },
        (error: any) => {
          console.error('Error al obtener la ubicación del usuario: ', error);
        }
      );
    } else {
      console.error('Geolocalización no es compatible en este navegador.');
    }
  }

  convertirPrecio(precio: number): number {
    // Asumiremos tasas de cambio predefinidas
    const tasaCOPtoUSD = 0.00020;
    const tasaCOPtoEUR = 0.00025;

    switch (this.monedaUsuario) {
      case 'COP':
        return precio;
      case 'EUR':
        return precio * tasaCOPtoEUR;
      case 'USD':
        return precio * tasaCOPtoUSD;
      default:
        return precio;
    }
  }


  //boton para agregar al carrito de compras
  addToCart(Id: string, Precio: number,Nombre: string) {

    this.carritoService.incrementarCantidad();
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
    const requestData = { id_carta: Id, price: Precio, nombre_carta:Nombre };

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
}
