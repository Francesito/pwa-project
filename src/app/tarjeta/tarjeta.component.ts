import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html'
})
export class TarjetaComponent {
  @Input() titulo = 'Mi tarjeta';
  @Input() descripcion = 'Descripción de la tarjeta';
  @Input() textoBoton = 'Ver detalles';
  @Input() detalles = 'Puedes personalizar el título, la descripción y estos detalles desde el componente que utiliza la tarjeta.';

  mostrarDetalles = false;

  @Output() seleccionar = new EventEmitter<void>();

  alternarDetalles(): void {
    this.mostrarDetalles = !this.mostrarDetalles;
    if (this.mostrarDetalles) {
      this.seleccionar.emit();
    }
  }
}
