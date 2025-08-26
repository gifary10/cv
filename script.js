// Dark mode toggle
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Add animation class
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 300);
}

// Check for saved theme preference
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

// SPA Navigation
function setupSPANavigation() {
  document.querySelectorAll('.spa-nav .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active nav link
      document.querySelectorAll('.spa-nav .nav-link').forEach(navLink => {
        navLink.classList.remove('active');
      });
      this.classList.add('active');
      
      // Show corresponding section
      const sectionId = this.getAttribute('data-section');
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });
      
      const targetSection = document.getElementById(`${sectionId}-section`);
      targetSection.classList.add('active');
      
      // Add animation
      targetSection.style.animation = 'none';
      setTimeout(() => {
        targetSection.style.animation = 'fadeIn 0.5s ease';
      }, 10);
      
      // Scroll to top of the section
      window.scrollTo({ top: targetSection.offsetTop - 20, behavior: 'smooth' });
    });
  });
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Animate progress bars when they come into view
function setupProgressBarAnimation() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 100);
        });
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('#skillsLevelContainer, #skillsLevelContainer2').forEach(container => {
    observer.observe(container);
  });
}

// Initialize tooltips
function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Add subtle animations to elements
function setupAnimations() {
  const animatedElements = document.querySelectorAll('.card-custom, .timeline-item, .chip');
  
  animatedElements.forEach(el => {
    el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
}

// Fetch and populate data from JSON
async function loadDataAndPopulate() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    populateData(data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Populate data from JSON
function populateData(data) {
  // Personal Info
  document.getElementById('fullName').textContent = data.personalInfo.fullName;
  document.getElementById('jobTitle').textContent = data.personalInfo.jobTitle;
  
  // Badges
  const badgesContainer = document.getElementById('badgesContainer');
  badgesContainer.innerHTML = '';
  data.personalInfo.badges.forEach(badge => {
    const badgeElement = document.createElement('span');
    badgeElement.className = 'badge bg-accent text-white me-2 mb-1';
    badgeElement.textContent = badge;
    badgesContainer.appendChild(badgeElement);
  });
  
  // Contact Info
  const contactInfoContainer = document.getElementById('contactInfoContainer');
  contactInfoContainer.innerHTML = '';
  data.contactInfo.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'kv-item';
    itemElement.innerHTML = `
      <div class="icon"><i class="${item.icon}"></i></div>
      <div>${item.url ? `<a href="${item.url}" class="text-decoration-none">${item.text}</a>` : item.text}</div>
    `;
    contactInfoContainer.appendChild(itemElement);
  });
  
  // Profile Summary
  document.getElementById('profileSummary').textContent = data.profileSummary;
  
  // Languages
  const languagesContainer = document.getElementById('languagesContainer');
  languagesContainer.innerHTML = '';
  data.languages.forEach(lang => {
    const langElement = document.createElement('div');
    langElement.innerHTML = `
      <strong>${lang.name}</strong>
      <div class="text-muted">${lang.level}</div>
    `;
    languagesContainer.appendChild(langElement);
  });
  
  // Certifications (Overview)
  const certificationsContainer = document.getElementById('certificationsContainer');
  certificationsContainer.innerHTML = '';
  data.certifications.forEach(cert => {
    const certElement = document.createElement('li');
    certElement.className = 'list-group-item d-flex align-items-center';
    certElement.innerHTML = `
      <i class="bi bi-patch-check-fill text-success me-2"></i>
      ${cert.name} – ${cert.issuer} (${cert.year})
    `;
    certificationsContainer.appendChild(certElement);
  });
  
  // Main Skills
  const mainSkillsContainer = document.getElementById('mainSkillsContainer');
  const mainSkillsContainer2 = document.getElementById('mainSkillsContainer2');
  mainSkillsContainer.innerHTML = '';
  mainSkillsContainer2.innerHTML = '';
  data.mainSkills.forEach(skill => {
    const skillElement = document.createElement('span');
    skillElement.className = 'chip';
    skillElement.textContent = skill;
    mainSkillsContainer.appendChild(skillElement.cloneNode(true));
    mainSkillsContainer2.appendChild(skillElement.cloneNode(true));
  });
  
  // Skills Level
  const skillsLevelContainer = document.getElementById('skillsLevelContainer');
  const skillsLevelContainer2 = document.getElementById('skillsLevelContainer2');
  skillsLevelContainer.innerHTML = '';
  skillsLevelContainer2.innerHTML = '';
  data.skillsLevel.forEach(skill => {
    const skillElement = document.createElement('div');
    skillElement.className = 'mb-3';
    skillElement.innerHTML = `
      <div class="d-flex justify-content-between">
        <span>${skill.name}</span>
        <span class="text-accent">${skill.level}</span>
      </div>
      <div class="progress mt-1 skill-bar">
        <div class="progress-bar" role="progressbar" style="width: 0%" data-width="${skill.percentage}" aria-valuenow="${skill.percentage}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `;
    skillsLevelContainer.appendChild(skillElement.cloneNode(true));
    skillsLevelContainer2.appendChild(skillElement.cloneNode(true));
  });
  
  // Work Experience
  const workExperienceContainer = document.getElementById('workExperienceContainer');
  workExperienceContainer.innerHTML = '';
  data.workExperience.forEach(exp => {
    const expElement = document.createElement('div');
    expElement.className = 'timeline-item';
    expElement.innerHTML = `
      <div class="text-muted small">${exp.period}</div>
      <h6 class="mb-1">${exp.company}</h6>
      <div class="fw-bold mb-2">${exp.position}</div>
      <ul class="mb-0">
        ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
      </ul>
    `;
    workExperienceContainer.appendChild(expElement);
  });
  
  // Education
  const educationContainer = document.getElementById('educationContainer');
  educationContainer.innerHTML = '';
  data.education.forEach(edu => {
    const eduElement = document.createElement('div');
    eduElement.className = 'timeline-item';
    eduElement.innerHTML = `
      <div class="text-muted small">${edu.period}</div>
      <h6 class="mb-1">${edu.institution}</h6>
      <div class="fw-bold mb-2">${edu.degree}</div>
      ${edu.gpa ? `<p>IPK: ${edu.gpa}</p>` : ''}
    `;
    educationContainer.appendChild(eduElement);
  });
  
  // Certifications (Detailed)
  const certificationsGridContainer = document.getElementById('certificationsGridContainer');
  certificationsGridContainer.innerHTML = '';
  data.certifications.forEach(cert => {
    const certElement = document.createElement('div');
    certElement.className = 'col-md-6 mb-3';
    certElement.innerHTML = `
      <div class="card card-custom h-100">
        <div class="card-body">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-accent text-white rounded p-2 me-3">
              <i class="bi bi-award-fill fs-4"></i>
            </div>
            <div>
              <h6 class="mb-0">${cert.name}</h6>
              <small class="text-muted">${cert.issuer} • ${cert.year}</small>
            </div>
          </div>
          ${cert.credentialId ? `<p class="mb-0 small"><strong>ID:</strong> ${cert.credentialId}</p>` : ''}
        </div>
      </div>
    `;
    certificationsGridContainer.appendChild(certElement);
  });
  
  // Projects
  const projectsContainer = document.getElementById('projectsContainer');
  projectsContainer.innerHTML = '';
  data.projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'timeline-item';
    projectElement.innerHTML = `
      <div class="text-muted small">${project.period}</div>
      <h6 class="mb-1">${project.name}</h6>
      <p class="mb-2">${project.description}</p>
      <div class="d-flex flex-wrap">
        ${project.technologies.map(tech => `<span class="badge bg-light text-dark me-2 mb-2">${tech}</span>`).join('')}
      </div>
    `;
    projectsContainer.appendChild(projectElement);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadThemePreference();
  setupSPANavigation();
  setupProgressBarAnimation();
  initTooltips();
  setupAnimations();
  loadDataAndPopulate();
  
  // Show scroll to top button when scrolling
  window.addEventListener('scroll', function() {
    const floatingBtn = document.querySelector('.floating-btn');
    if (window.scrollY > 300) {
      floatingBtn.style.opacity = '1';
      floatingBtn.style.visibility = 'visible';
    } else {
      floatingBtn.style.opacity = '0';
      floatingBtn.style.visibility = 'hidden';
    }
  });
});