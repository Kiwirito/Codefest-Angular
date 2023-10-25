import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalEjemploComponent } from '../components/modal-ejemplo/modal-ejemplo.component';

@Injectable({
  providedIn: 'root'
})
export class ModalEjemploService {

  private modalNotifier?: Subject<string>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) { }

  open(content: TemplateRef<any>, options?: {size?: string; title?: string}) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(ModalEjemploComponent);
    const contentViewRef = content.createEmbeddedView(null);
    const modalComponent = modalComponentFactory.create(this.injector, [contentViewRef.rootNodes,]);


    modalComponent.instance.size = options?.size;
    modalComponent.instance.title = options?.title;
    modalComponent.instance.closeEvent.subscribe(() => this.closeModal())
    modalComponent.instance.submitEvent.subscribe(() => this.submitModal())

    modalComponent.hostView.detectChanges();
    this.document.body.appendChild(modalComponent.location.nativeElement);

    this.modalNotifier = new Subject();
    return this.modalNotifier.asObservable();

  }

  closeModal(){
    this.modalNotifier?.complete();
  }

  submitModal(){
    this.modalNotifier?.next('confirm');
    this.closeModal()
  }


}
