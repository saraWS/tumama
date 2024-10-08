import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonList, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-materia-detalle',
  templateUrl: './materia-detalle.page.html',
  styleUrls: ['./materia-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonList, IonButtons, IonMenuButton]
})
export class MateriaDetallePage {
  materia: any;
  promedio: number | null = null;
  estado: string = '';

  constructor(private router: Router) {
    // Recuperar el estado pasado
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.materia = navigation.extras.state['materia']; // Acceso usando corchetes
      this.calcularPromedio(); // Calcular promedio al cargar la materia
    } else {
      // En caso de que no se pase la materia en el estado de la navegación, cargar desde localStorage
      this.cargarMateria('codigo-de-la-materia'); // Aquí deberías pasar el código de la materia deseada
    }
  }

  cargarMateria(codigo: string) {
    const materias = JSON.parse(localStorage.getItem('materias') || '[]');
    this.materia = materias.find((m: any) => m.codigo === codigo);
    this.calcularPromedio(); // Calcular promedio al cargar la materia
  }

  calcularPromedio() {
    if (this.materia.notas && this.materia.notas.length > 0) {
      const totalNotas = this.materia.notas.reduce((acc: number, nota: any) => {
        const corte1 = nota.corte1 || 0;
        const corte2 = nota.corte2 || 0;
        const corte3 = nota.corte3 || 0;
        const corteFinal = nota.corteFinal || 0;

        return acc + (corte1 * 0.2) + (corte2 * 0.2) + (corte3 * 0.2) + (corteFinal * 0.4);
      }, 0);
      this.promedio = totalNotas / this.materia.notas.length;
      this.estado = this.promedio >= 30 ? 'Aprobado' : 'Reprobado'; // Determinar el estado basado en el promedio
    } else {
      this.promedio = null;
      this.estado = 'Reprobado'; // Si no hay notas, se considera reprobado
    }
  }

  modificarMateria() {
    // Lógica para modificar la materia y guardar los cambios
    const materias = JSON.parse(localStorage.getItem('materias') || '[]');
    const index = materias.findIndex((m: any) => m.codigo === this.materia.codigo);
    if (index !== -1) {
      materias[index] = this.materia; // Actualizar la materia
      localStorage.setItem('materias', JSON.stringify(materias));
    }
    this.router.navigate(['/home']); // Redirigir a la página principal
  }

  agregarNotas() {
    this.router.navigate(['/agregar-notas'], {
      state: { materia: this.materia }
    });
  }

  eliminarNota(index: number) {
    this.materia.notas.splice(index, 1); // Eliminar la nota
    this.calcularPromedio(); // Recalcular promedio después de eliminar
    this.actualizarMaterias(); // Actualizar en localStorage
  }

  actualizarMaterias() {
    const materias = JSON.parse(localStorage.getItem('materias') || '[]');
    const index = materias.findIndex((m: any) => m.codigo === this.materia.codigo);
    if (index !== -1) {
      materias[index] = this.materia;
      localStorage.setItem('materias', JSON.stringify(materias));
    }
  }
}
