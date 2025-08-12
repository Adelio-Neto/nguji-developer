class CoursesManager {
  constructor() {
    this.courses = [];
    this.filteredCourses = [];
    this.currentPage = 1;
    this.coursesPerPage = 6;
    this.activeFilters = {
      categories: ['Todas as Categorias'],
      levels: ['Todos os Níveis'],
      durations: [],
      searchTerm: ''
    };
    this.sortBy = 'popular';
    
    this.init();
  }

  async init() {
    await this.loadCourses();
    this.setupEventListeners();
    this.filterAndDisplayCourses();
  }

  async loadCourses() {
    try {
      const response = await fetch('courses-data.json');
      const data = await response.json();
      this.courses = data.courses;
      this.filteredCourses = [...this.courses];
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  }

  setupEventListeners() {
    // Filtros de categoria
    const categoryCheckboxes = document.querySelectorAll('.filter-group:nth-child(1) .filter-checkbox input');
    categoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.handleCategoryFilter(checkbox));
    });

    // Filtros de nível
    const levelCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) .filter-checkbox input');
    levelCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.handleLevelFilter(checkbox));
    });

    // Filtros de duração
    const durationCheckboxes = document.querySelectorAll('.filter-group:nth-child(3) .filter-checkbox input');
    durationCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.handleDurationFilter(checkbox));
    });

    // Busca
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', (e) => {
      this.activeFilters.searchTerm = e.target.value.toLowerCase();
      this.filterAndDisplayCourses();
    });

    // Ordenação
    const sortSelect = document.querySelector('.sort-dropdown select');
    sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.filterAndDisplayCourses();
    });
  }

  handleCategoryFilter(checkbox) {
    const category = checkbox.nextElementSibling.nextElementSibling.textContent.trim();
    
    if (category === 'Todas as Categorias') {
      if (checkbox.checked) {
        this.activeFilters.categories = ['Todas as Categorias'];
        // Desmarcar outras categorias
        const otherCheckboxes = document.querySelectorAll('.filter-group:nth-child(1) .filter-checkbox input:not(:first-child)');
        otherCheckboxes.forEach(cb => cb.checked = false);
      }
    } else {
      if (checkbox.checked) {
        // Remover "Todas as Categorias" se outra categoria for selecionada
        const allCategoriesIndex = this.activeFilters.categories.indexOf('Todas as Categorias');
        if (allCategoriesIndex > -1) {
          this.activeFilters.categories.splice(allCategoriesIndex, 1);
          document.querySelector('.filter-group:nth-child(1) .filter-checkbox input').checked = false;
        }
        this.activeFilters.categories.push(category);
      } else {
        const index = this.activeFilters.categories.indexOf(category);
        if (index > -1) {
          this.activeFilters.categories.splice(index, 1);
        }
        // Se nenhuma categoria específica estiver selecionada, marcar "Todas as Categorias"
        if (this.activeFilters.categories.length === 0) {
          this.activeFilters.categories = ['Todas as Categorias'];
          document.querySelector('.filter-group:nth-child(1) .filter-checkbox input').checked = true;
        }
      }
    }
    
    this.filterAndDisplayCourses();
  }

  handleLevelFilter(checkbox) {
    const level = checkbox.nextElementSibling.nextElementSibling.textContent.trim();
    
    if (level === 'Todos os Níveis') {
      if (checkbox.checked) {
        this.activeFilters.levels = ['Todos os Níveis'];
        const otherCheckboxes = document.querySelectorAll('.filter-group:nth-child(2) .filter-checkbox input:not(:first-child)');
        otherCheckboxes.forEach(cb => cb.checked = false);
      }
    } else {
      if (checkbox.checked) {
        const allLevelsIndex = this.activeFilters.levels.indexOf('Todos os Níveis');
        if (allLevelsIndex > -1) {
          this.activeFilters.levels.splice(allLevelsIndex, 1);
          document.querySelector('.filter-group:nth-child(2) .filter-checkbox input').checked = false;
        }
        this.activeFilters.levels.push(level);
      } else {
        const index = this.activeFilters.levels.indexOf(level);
        if (index > -1) {
          this.activeFilters.levels.splice(index, 1);
        }
        if (this.activeFilters.levels.length === 0) {
          this.activeFilters.levels = ['Todos os Níveis'];
          document.querySelector('.filter-group:nth-child(2) .filter-checkbox input').checked = true;
        }
      }
    }
    
    this.filterAndDisplayCourses();
  }

  handleDurationFilter(checkbox) {
    const duration = checkbox.nextElementSibling.nextElementSibling.textContent.trim();
    
    if (checkbox.checked) {
      this.activeFilters.durations.push(duration);
    } else {
      const index = this.activeFilters.durations.indexOf(duration);
      if (index > -1) {
        this.activeFilters.durations.splice(index, 1);
      }
    }
    
    this.filterAndDisplayCourses();
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course => {
      // Filtro de categoria
      const categoryMatch = this.activeFilters.categories.includes('Todas as Categorias') || 
                           this.activeFilters.categories.includes(course.category);

      // Filtro de nível
      const levelMatch = this.activeFilters.levels.includes('Todos os Níveis') || 
                        this.activeFilters.levels.includes(course.level);

      // Filtro de duração
      let durationMatch = true;
      if (this.activeFilters.durations.length > 0) {
        durationMatch = this.activeFilters.durations.some(duration => {
          if (duration === 'Menos de 5 horas') return course.duration < 5;
          if (duration === '5 a 20 horas') return course.duration >= 5 && course.duration <= 20;
          if (duration === 'Mais de 20 horas') return course.duration > 20;
          return false;
        });
      }

      // Filtro de busca
      const searchMatch = this.activeFilters.searchTerm === '' || 
                         course.title.toLowerCase().includes(this.activeFilters.searchTerm) ||
                         course.description.toLowerCase().includes(this.activeFilters.searchTerm);

      return categoryMatch && levelMatch && durationMatch && searchMatch;
    });
  }

  sortCourses() {
    this.filteredCourses.sort((a, b) => {
      switch (this.sortBy) {
        case 'Mais Recentes':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'Preço: Menor para Maior':
          return a.price - b.price;
        case 'Preço: Maior para Menor':
          return b.price - a.price;
        case 'Duração: Curta para Longa':
          return a.duration - b.duration;
        default: // Mais Populares
          return b.students - a.students;
      }
    });
  }

  filterAndDisplayCourses() {
    this.filterCourses();
    this.sortCourses();
    this.currentPage = 1;
    this.displayCourses();
    this.updatePagination();
  }

  displayCourses() {
    const container = document.querySelector('.courses-grid .row');
    const startIndex = (this.currentPage - 1) * this.coursesPerPage;
    const endIndex = startIndex + this.coursesPerPage;
    const coursesToShow = this.filteredCourses.slice(startIndex, endIndex);

    container.innerHTML = '';

    coursesToShow.forEach(course => {
      const courseCard = this.createCourseCard(course);
      container.appendChild(courseCard);
    });

    // Se não há cursos para mostrar
    if (coursesToShow.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="no-courses-message">
            <h4>Nenhum curso encontrado</h4>
            <p>Tente ajustar os filtros para encontrar mais cursos.</p>
          </div>
        </div>
      `;
    }
  }

  createCourseCard(course) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 col-md-6';

    const badgeHtml = course.badge ? `<div class="course-badge ${course.badge === 'Gratuito' ? 'badge-free' : course.badge === 'Novo' ? 'badge-new' : course.badge === 'Certificado' ? 'badge-certificate' : ''}">${course.badge}</div>` : '';
    const priceHtml = course.price > 0 ? `<div class="course-price">Kz ${course.price.toLocaleString()}</div>` : '';
    const buttonText = course.price === 0 ? 'Iniciar Curso Gratuito' : 'Inscreva-se agora';

    // Criar stars
    const fullStars = Math.floor(course.rating);
    const hasHalfStar = course.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="bi bi-star-fill"></i>';
    }
    if (hasHalfStar) {
      starsHtml += '<i class="bi bi-star-half"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="bi bi-star"></i>';
    }

    col.innerHTML = `
      <div class="course-card">
        <div class="course-image">
          <img src="${course.image}" alt="Curso" class="img-fluid" />
          ${badgeHtml}
          ${priceHtml}
        </div>
        <div class="course-content">
          <div class="course-meta">
            <span class="category">${course.category}</span>
            <span class="level">${course.level}</span>
          </div>
          <h3>${course.title}</h3>
          <p>${course.description.substring(0, 80)}...</p>
          <div class="course-stats">
            <div class="stat">
              <i class="bi bi-clock"></i> <span>${course.duration} horas</span>
            </div>
            <div class="stat">
              <i class="bi bi-people"></i>
              <span>${course.students.toLocaleString()} estudantes</span>
            </div>
            <div class="rating">
              ${starsHtml}
              <span>${course.rating} (${course.reviews} avaliações)</span>
            </div>
          </div>
          <a href="" class="btn-course">${buttonText}</a>
        </div>
      </div>
    `;

    return col;
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredCourses.length / this.coursesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    paginationContainer.innerHTML = '';

    // Botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#"><i class="bi bi-chevron-left"></i></a>`;
    if (this.currentPage > 1) {
      prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage--;
        this.displayCourses();
        this.updatePagination();
      });
    }
    paginationContainer.appendChild(prevLi);

    // Números das páginas
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage = i;
        this.displayCourses();
        this.updatePagination();
      });
      paginationContainer.appendChild(li);
    }

    // Botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${this.currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#"><i class="bi bi-chevron-right"></i></a>`;
    if (this.currentPage < totalPages) {
      nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        this.currentPage++;
        this.displayCourses();
        this.updatePagination();
      });
    }
    paginationContainer.appendChild(nextLi);
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new CoursesManager();
});