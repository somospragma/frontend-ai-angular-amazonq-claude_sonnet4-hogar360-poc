import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company info -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-2xl font-bold mb-4">Hogar360</h3>
            <p class="text-gray-300 mb-4">
              Tu plataforma inmobiliaria de confianza para encontrar el hogar perfecto.
            </p>
          </div>

          <!-- Quick links -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white">Propiedades</a></li>
              <li><a href="#" class="hover:text-white">Categorías</a></li>
              <li><a href="#" class="hover:text-white">Contacto</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Contacto</h4>
            <ul class="space-y-2 text-gray-300">
              <li>info&#64;hogar360.com</li>
              <li>+57 300 123 4567</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hogar360. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}