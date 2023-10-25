import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal/public_api';

let paypal;

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos-page.component.html',
    styleUrls: ['./pagos-page.component.css']
})
export class PaymentPageComponent implements OnInit{
    public payPalConfig?: IPayPalConfig;


    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void{
        this.payPalConfig = {
            currency: 'USD',
            clientId: 'AaaPkQgLFmbMCIMMcBBZ0WO1BxyV36rRZA7rmEse6xsN5ZyDdu-bl8RzyDN4meLXICCgccPkHiSWE3S3',
            createOrderOnClient: (data) => <ICreateOrderRequest> {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '9.99',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '9.99'
                            }
                        }
                    },
                    items: [{
                        name: 'Enterprise Subscription',
                        quantity: '1',
                        category: 'DIGITAL_GOODS',
                        unit_amount: {
                            currency_code: 'USD',
                            value: '9.99',
                        },
                    }]
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