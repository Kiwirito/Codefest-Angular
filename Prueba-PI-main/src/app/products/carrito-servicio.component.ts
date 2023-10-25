import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cantidadProductosEnCarritoSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cantidadProductosEnCarrito$ = this.cantidadProductosEnCarritoSubject.asObservable();

  constructor() { }

  obtenerCantidadProductosEnCarrito(): number {
    return this.cantidadProductosEnCarritoSubject.value;
  }

  incrementarCantidad(): void {
    const valorActual = this.cantidadProductosEnCarritoSubject.value;
    this.cantidadProductosEnCarritoSubject.next(valorActual + 1);
  }
}
