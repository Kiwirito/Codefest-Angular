import { Component, OnInit, TemplateRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  mostrarFooter: boolean = true;

  constructor(private modalService: ModalService,private router: Router){}

  openModal(modalTemplate:TemplateRef<any>){
    this.modalService.open(modalTemplate, {size: 'lg', title:'Términos y Condiciones The Nexus Battles II'})
    .subscribe((action) => {
      console.log('ModalAction', action)
    })
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Comprueba la ruta actual
        if (event.url === '/login' || event.url === '/register') {
          // Si la ruta es "/login", oculta el encabezado
          this.mostrarFooter = false;
        } else {
          // En otras rutas, muestra el encabezado
          this.mostrarFooter = true;
        }
      }
    });
  }

}
