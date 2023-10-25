import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal/public_api';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

let paypal;

//interface de la carta
interface Carta {
    id_carta: string;
    activo: boolean;
    urlImagen: string;
    price: number;
    quantity: number;
    nombre_carta: string;
    order_id: number;
    order_total: number;
}

@Component({
    selector: 'app-order',
    templateUrl: './order-page.component.html',
    styleUrls: ['./order-page.component.css']
})

export class OrderPageComponent implements OnInit {
    public payPalConfig?: IPayPalConfig;

    order: any = {};
    Items: Carta[] = [];
    subtotal: number = 0;
    iva: number = 0;
    total: number = 0;

    constructor(private http: HttpClient, private route: ActivatedRoute,private cookieService: CookieService,private router: Router) {
        this.order= {}
    }
    
    ngOnInit(): void {
        this.getOrder();
    }

    getOrder(): void { 
        this.route.params.subscribe(params => {
            const orderId = params['orderId'];

            const accessToken = this.cookieService.get('access_token');

            if (!accessToken) {
                console.error('No se ha encontrado el token de acceso.');
                return;
            }

            const cartEndpoint =`https://webserver.thenexusbattles2.cloud/obtener-orden/${orderId}`
            //const cartEndpoint = `http://127.0.0.1:8003/api/order/${orderId}`;
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            });
        
            this.http.get<Carta[]>(cartEndpoint,{ headers }).subscribe(
                (data: any) => {
                    this.order = data.order_id;
                    this.Items = data.Items;
                    console.log('Respuesta de la API:', data);
                    const cop = this.order.order_total;
                    const usd = cop * 0.00026
                    this.initConfig(usd);
                },
                (error) => {
                    console.error('Error al obtener el carrito de compras:', error);
                }
            );
        })
        
    }
    
    //configuracion de paypal
    private initConfig(orderTotal: number): void{
        this.payPalConfig = {
            currency: 'USD',
            clientId: 'AaaPkQgLFmbMCIMMcBBZ0WO1BxyV36rRZA7rmEse6xsN5ZyDdu-bl8RzyDN4meLXICCgccPkHiSWE3S3',
            createOrderOnClient: (data) => <ICreateOrderRequest> {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: orderTotal.toFixed(2),
                    },
                }]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
                const accessToken = this.cookieService.get('access_token');

                if (!accessToken) {
                    console.error('No se ha encontrado el token de acceso.');
                    return;
                }

                const paymentID = data.id
                const status = data.status

                const paymentDetails = {
                    paymentID:paymentID,
                    status:status,
                    order_id:this.order.order_id,
                    order_total:this.order.order_total
                }

                const apiUrl = 'https://webserver.thenexusbattles2.cloud/pagar-orden';
                //const apiUrl = 'http://localhost:3000/pagar-orden';
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                });

                this.http.post(apiUrl, paymentDetails, { headers }).subscribe(
                    (response) => {
                        console.log('Respuesta del backend:', response);
                        this.router.navigate(['/banco']);
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