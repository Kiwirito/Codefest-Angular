import { Component, TemplateRef } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private modalService: ModalService){}

  openModal(modalTemplate:TemplateRef<any>){
    this.modalService.open(modalTemplate, {size: 'lg', title:'Términos y Condiciones The Nexus Battles II'})
    .subscribe((action) => {
      console.log('ModalAction', action)
    })
  }

}
