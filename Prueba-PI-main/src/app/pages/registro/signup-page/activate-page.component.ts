
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector:'app-activate',
  templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
  constructor(private http: HttpClient, private route:ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      const uid = params['uid'];
      const token = params['token'];

      this.activarCuenta(uid,token);

    })

  }

  activarCuenta(uid: string, token: string){
    this.http.get(`https://api.thenexusbattles2.cloud/ldap/api/activate/${uid}/${token}/`).subscribe(
      (response) =>{
        console.log('Cuenta activada:',response)
      },
      (error) =>{
        console.log('Error al activar cuenta:',error)
      }
    )
  }
}
