import { Component, OnInit,ElementRef, AfterViewChecked   } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal/public_api';
import { CookieService } from 'ngx-cookie-service';
let paypal;

//interface de la carta
interface Carta {
    id_carta: string;
    img: string;
    games: number;
    price: number;
    title: string;
    sub: boolean;
}

@Component({
    selector: 'app-membresia-page',
    templateUrl: './membresia-page.component.html',
    styleUrls: ['./membresia-page.component.css']
})

export class MembershipPageComponent  implements OnInit{
    //public payPalConfig?: IPayPalConfig;

    //guardar cartas
    cartas: Carta[] = [];
    paypalConfig: Record<string, IPayPalConfig> = {};

    constructor(private http: HttpClient,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private cookieService: CookieService,
    )  {}

    ngOnInit(): void {
        this.getCartas();
    }

  //obtener las cartas de la API
    getCartas(): void {
    //const apiUrl = `http://127.0.0.1:8000/api/membership/`;
    const apiUrl = `https://api.thenexusbattles2.cloud/cartas/api/membership/`;

    this.http.get<Carta[]>(apiUrl).subscribe(data => {
        this.cartas = data;
        this.cartas.forEach(carta => {
            this.initConfig(carta);
        });
    });
    console.log(this.cartas)
    }

    //configuracion de paypal
    private initConfig(carta: Carta): void{
        const usd = carta.price * 0.0002;
        this.paypalConfig[carta.id_carta] = {
            currency: 'USD',
            clientId: 'AaaPkQgLFmbMCIMMcBBZ0WO1BxyV36rRZA7rmEse6xsN5ZyDdu-bl8RzyDN4meLXICCgccPkHiSWE3S3',
            createOrderOnClient: (data) => <ICreateOrderRequest> {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: usd.toFixed(2),
                    },
                    reference_id: carta.id_carta,
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical',
                color: 'silver',
                shape: 'pill',
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                console.log(carta.games)
                const accessToken = this.cookieService.get('access_token');

                if (!accessToken) {
                    console.error('No se ha encontrado el token de acceso.');
                    return;
                }

                const games = carta.games

                const paymentDetails = {
                    games:games,
                }

                const apiUrl = 'https://webserver.thenexusbattles2.cloud/comprar-membresia';
                //const apiUrl = 'http://localhost:3000/comprar-membresia';
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                });

                this.http.post(apiUrl, paymentDetails, { headers }).subscribe(
                    (response) => {
                        console.log('Respuesta del backend:', response);
                    },
                    (error) => {
                        console.error('Error al enviar los datos de pago al backend:', error);
                    }
                );
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);

            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            }
        }
    }


}

