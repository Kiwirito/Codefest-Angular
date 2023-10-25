import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-cart',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})

export class CartComponent {
    constructor(private http: HttpClient) {}

    addToCart(id_carta: string) {
        // Realizar una solicitud HTTP para agregar la carta al carrito
        const cartEndpoint = 'http://localhost:3000/enviar-token';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const requestData = { id_carta: id_carta };

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
