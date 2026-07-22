// ====== EXISTING CODE (preserved exactly) ======

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
}, observerOptions);

// Observe skill cards and timeline items
document.querySelectorAll('.skill-card, .timeline-item').forEach(el => {
    observer.observe(el);
});

// Hero fade in (already CSS, but reinforce)
window.addEventListener('load', () => {
    document.querySelector('.hero-content').style.opacity = '1';
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Simulate send (in real: use EmailJS or backend)
    alert('Thank you! Your message has been sent. (Demo)');
    this.reset();
});

// Navbar scroll effect (if added later)
// Window scroll for parallax hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Active nav highlight (if nav added)
});

// ====== THEME TOGGLE (improved) ======

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Update toggle button icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Add theme toggle button to hero (bonus)
const themeBtn = document.createElement('button');
themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
themeBtn.className = 'btn btn-secondary theme-toggle';
themeBtn.style.width = '56px';
themeBtn.style.height = '56px';
themeBtn.style.borderRadius = '50%';
themeBtn.style.display = 'flex';
themeBtn.style.alignItems = 'center';
themeBtn.style.justifyContent = 'center';
themeBtn.style.fontSize = '1.3rem';
themeBtn.style.padding = '0';
themeBtn.onclick = toggleTheme;

// Update icon immediately if already dark
if (localStorage.getItem('theme') === 'dark') {
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

// Insert theme toggle at the start of hero-buttons
const heroButtons = document.querySelector('.hero-buttons');
if (heroButtons) {
    heroButtons.insertBefore(themeBtn, heroButtons.firstChild);
}

// ====== PROFILE PICTURE MANAGEMENT ======

const defaultProfileData = { src: '' };
let profileData = loadData('portfolio_profile', defaultProfileData);

const profilePic = document.getElementById('profilePic');
const profilePlaceholder = document.getElementById('profilePicPlaceholder');
const profilePicInput = document.getElementById('profilePicInput');
const removeProfilePicBtn = document.getElementById('removeProfilePic');
const managePicInput = document.getElementById('managePicInput');
const manageRemovePic = document.getElementById('manageRemovePic');
const manageProfilePic = document.getElementById('manageProfilePic');
const manageProfilePlaceholder = document.getElementById('manageProfilePlaceholder');

function renderProfilePic() {
    if (profileData.src) {
        profilePic.src = profileData.src;
        profilePic.style.display = 'block';
        profilePlaceholder.style.display = 'none';
        removeProfilePicBtn.style.display = 'flex';
        // Manage panel
        manageProfilePic.src = profileData.src;
        manageProfilePic.style.display = 'block';
        manageProfilePlaceholder.style.display = 'none';
    } else {
        profilePic.style.display = 'none';
        profilePlaceholder.style.display = 'flex';
        removeProfilePicBtn.style.display = 'none';
        manageProfilePic.style.display = 'none';
        manageProfilePlaceholder.style.display = 'flex';
    }
}

function handleProfileFile(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert('Image too large. Max 2MB allowed.');
        return;
    }
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        profileData.src = e.target.result;
        saveData('portfolio_profile', profileData);
        renderProfilePic();
    };
    reader.readAsDataURL(file);
}

profilePicInput.addEventListener('change', function() {
    handleProfileFile(this.files[0]);
    this.value = '';
});

managePicInput.addEventListener('change', function() {
    handleProfileFile(this.files[0]);
    this.value = '';
});

removeProfilePicBtn.addEventListener('click', function() {
    if (confirm('Remove profile picture?')) {
        profileData.src = '';
        saveData('portfolio_profile', profileData);
        renderProfilePic();
    }
});

manageRemovePic.addEventListener('click', function() {
    profileData.src = '';
    saveData('portfolio_profile', profileData);
    renderProfilePic();
});

// Initial render
renderProfilePic();

// ====== SKILLS MANAGEMENT ======

const defaultSkills = [
    { id: 1, name: 'Digital Marketing', icon: 'fa-bullhorn', desc: 'Basic understanding of digital marketing strategies including promoting products and services through online platforms, social media marketing, and improving brand visibility on the internet.' },
    { id: 2, name: 'Generative AI', icon: 'fa-robot', desc: 'Learning and using AI tools to generate content, assist in research, create marketing ideas, and improve productivity in digital work.' },
    { id: 3, name: 'eCommerce & Online Selling', icon: 'fa-shopping-cart', desc: 'Experience in online selling platforms including product research, product listing, customer communication, and order management.' },
    { id: 4, name: 'Content Creation', icon: 'fa-pen-fancy', desc: 'Ability to create digital content for social media platforms such as posts, short content ideas, and simple promotional material for online audiences.' },
    { id: 5, name: 'Social Media Marketing', icon: 'fa-share-alt', desc: 'Understanding how to promote products and services through social media platforms to increase audience engagement and reach potential customers.' },
    { id: 6, name: 'Computer & Internet Skills', icon: 'fa-laptop', desc: 'Good knowledge of computer usage including internet research, document preparation, online tools, and digital communication.' }
];

let skillsData = loadData('portfolio_skills', defaultSkills);
let editingSkillId = null;

function saveSkills() {
    saveData('portfolio_skills', skillsData);
    renderSkillsGrid();
    renderSkillsList();
}

function renderSkillsGrid() {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = '';
    skillsData.forEach((skill, index) => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.transitionDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <i class="fas ${skill.icon}"></i>
            <h3>${escapeHtml(skill.name)}</h3>
            ${skill.desc ? `<p>${escapeHtml(skill.desc)}</p>` : ''}
        `;
        grid.appendChild(card);
        // Re-observe for animation
        observer.observe(card);
    });
}

function renderSkillsList() {
    const list = document.getElementById('skillsList');
    list.innerHTML = '';
    skillsData.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'manage-list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4><i class="fas ${skill.icon}" style="color:#667eea;margin-right:8px;"></i>${escapeHtml(skill.name)}</h4>
            </div>
            <div class="item-actions">
                <button class="edit-btn" data-id="${skill.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${skill.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        item.querySelector('.edit-btn').addEventListener('click', () => editSkill(skill.id));
        item.querySelector('.delete-btn').addEventListener('click', () => deleteSkill(skill.id));
        list.appendChild(item);
    });
}

function addSkill() {
    const nameInput = document.getElementById('skillNameInput');
    const iconInput = document.getElementById('skillIconInput');
    const name = nameInput.value.trim();
    const icon = iconInput.value.trim() || 'fa-code';
    if (!name) { alert('Please enter a skill name.'); return; }
    if (editingSkillId) {
        const skill = skillsData.find(s => s.id === editingSkillId);
        if (skill) { skill.name = name; skill.icon = icon; }
        editingSkillId = null;
        document.getElementById('addSkillBtn').textContent = 'Add Skill';
    } else {
        skillsData.push({ id: Date.now(), name, icon, desc: '' });
    }
    nameInput.value = '';
    iconInput.value = '';
    saveSkills();
}

function editSkill(id) {
    const skill = skillsData.find(s => s.id === id);
    if (!skill) return;
    document.getElementById('skillNameInput').value = skill.name;
    document.getElementById('skillIconInput').value = skill.icon;
    editingSkillId = id;
    document.getElementById('addSkillBtn').textContent = 'Update Skill';
}

function deleteSkill(id) {
    if (!confirm('Delete this skill?')) return;
    skillsData = skillsData.filter(s => s.id !== id);
    if (editingSkillId === id) {
        editingSkillId = null;
        document.getElementById('addSkillBtn').textContent = 'Add Skill';
        document.getElementById('skillNameInput').value = '';
        document.getElementById('skillIconInput').value = '';
    }
    saveSkills();
}

document.getElementById('addSkillBtn').addEventListener('click', addSkill);

// ====== PROJECTS MANAGEMENT ======

const defaultProjects = (typeof portfolioData !== 'undefined' && portfolioData.projects) ? portfolioData.projects : [];

let projectsData = loadData('portfolio_projects', null) || defaultProjects.map(p => ({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies }));
let editingProjectId = null;
let projectImageData = '';

function saveProjects() {
    saveData('portfolio_projects', projectsData);
    renderProjectsSection();
    renderProjectsList();
}

function renderProjectsSection() {
    const section = document.getElementById('projects');
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    if (!projectsData || projectsData.length === 0) {
        return;
    }
    projectsData.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animation = 'fadeInUp 0.6s ease-out';
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animationFillMode = 'both';

        const techArr = proj.technologies ? (typeof proj.technologies === 'string' ? proj.technologies.split(',').map(t => t.trim()) : proj.technologies) : [];
        const techHtml = techArr.map(t => `<span>${escapeHtml(t)}</span>`).join('');

        const hasImage = proj.image && proj.image.startsWith('data:');

        card.innerHTML = `
            <div class="project-image-wrapper">
                ${hasImage ? `<img src="${proj.image}" alt="${escapeHtml(proj.title)}">` : `<i class="fas fa-code project-icon"></i>`}
            </div>
            <div class="project-body">
                <h3>${escapeHtml(proj.title)}</h3>
                ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ''}
                ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ''}
                <div class="project-links">
                    ${proj.github ? `<a href="${escapeHtml(proj.github)}" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${proj.demo ? `<a href="${escapeHtml(proj.demo)}" target="_blank" class="demo-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
        observer.observe(card);
    });
}

function renderProjectsList() {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';
    if (!projectsData || projectsData.length === 0) {
        list.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">No projects yet. Add your first project above.</p>';
        return;
    }
    projectsData.forEach(proj => {
        const item = document.createElement('div');
        item.className = 'manage-list-item';
        const techStr = typeof proj.technologies === 'string' ? proj.technologies : (Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '');
        item.innerHTML = `
            <div class="item-info">
                <h4>${escapeHtml(proj.title)}</h4>
                <p>${techStr || 'No technologies'}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" data-id="${proj.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${proj.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        item.querySelector('.edit-btn').addEventListener('click', () => editProject(proj.id));
        item.querySelector('.delete-btn').addEventListener('click', () => deleteProject(proj.id));
        list.appendChild(item);
    });
}

function addProject() {
    const title = document.getElementById('projTitleInput').value.trim();
    const desc = document.getElementById('projDescInput').value.trim();
    const tech = document.getElementById('projTechInput').value.trim();
    const github = document.getElementById('projGitInput').value.trim();
    const demo = document.getElementById('projDemoInput').value.trim();

    if (!title) { alert('Please enter a project title.'); return; }

    if (editingProjectId) {
        const proj = projectsData.find(p => p.id === editingProjectId);
        if (proj) {
            proj.title = title;
            proj.description = desc;
            proj.technologies = tech;
            proj.github = github;
            proj.demo = demo;
            if (projectImageData) proj.image = projectImageData;
        }
        editingProjectId = null;
        document.getElementById('addProjectBtn').textContent = 'Add Project';
    } else {
        projectsData.push({
            id: Date.now(),
            title,
            description: desc,
            technologies: tech,
            github,
            demo,
            image: projectImageData
        });
    }

    // Clear form
    document.getElementById('projTitleInput').value = '';
    document.getElementById('projDescInput').value = '';
    document.getElementById('projTechInput').value = '';
    document.getElementById('projGitInput').value = '';
    document.getElementById('projDemoInput').value = '';
    projectImageData = '';
    saveProjects();
}

function editProject(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;
    document.getElementById('projTitleInput').value = proj.title;
    document.getElementById('projDescInput').value = proj.description || '';
    document.getElementById('projTechInput').value = proj.technologies || '';
    document.getElementById('projGitInput').value = proj.github || '';
    document.getElementById('projDemoInput').value = proj.demo || '';
    projectImageData = proj.image || '';
    editingProjectId = id;
    document.getElementById('addProjectBtn').textContent = 'Update Project';
}

function deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    projectsData = projectsData.filter(p => p.id !== id);
    if (editingProjectId === id) {
        editingProjectId = null;
        document.getElementById('addProjectBtn').textContent = 'Add Project';
        document.getElementById('projTitleInput').value = '';
        document.getElementById('projDescInput').value = '';
        document.getElementById('projTechInput').value = '';
        document.getElementById('projGitInput').value = '';
        document.getElementById('projDemoInput').value = '';
        projectImageData = '';
    }
    saveProjects();
}

document.getElementById('addProjectBtn').addEventListener('click', addProject);

document.getElementById('projImgInput').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        projectImageData = e.target.result;
        alert('Image ready. Click "Add Project" to save.');
    };
    reader.readAsDataURL(file);
    this.value = '';
});

// ====== MANAGEMENT PANEL ======

const managePanel = document.getElementById('managePanel');
const closePanel = document.getElementById('closePanel');

closePanel.addEventListener('click', function() {
    managePanel.style.display = 'none';
});

managePanel.addEventListener('click', function(e) {
    if (e.target === managePanel) managePanel.style.display = 'none';
});

// Tabs
document.querySelectorAll('.manage-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.manage-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.manage-tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
        if (this.dataset.tab === 'skillsTab') renderSkillsList();
        if (this.dataset.tab === 'projectsTab') renderProjectsList();
    });
});

// ====== UTILITY FUNCTIONS ======

function loadData(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
}

function saveData(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch { console.warn('Failed to save data'); }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====== ADMIN PANEL - PROFILE INFO ======

const defaultProfileInfo = {
  name: 'Qamar Abbas',
  title: 'Generative AI | eCommerce',
  shortBio: 'Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online.',
  about: 'Motivated and dedicated BBA graduate with knowledge of Digital Marketing, Generative AI, eCommerce, and Content Creation. I aim to use my business and digital skills to help businesses grow online, improve brand visibility, and manage digital platforms effectively while continuing to learn modern technologies.',
  email: 'sheikhuqamar@gmail.com',
  phone: '0347 8094332',
  location: 'Gilgit-Baltistan, Pakistan',
  social: {
    linkedin: 'https://www.linkedin.com/in/qamar-abbas-1181b2402?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: '',
    website: 'https://sckarma-tech.netlify.app/'
  }
};

let profileInfo = loadData('portfolio_profile_info', defaultProfileInfo);

function saveProfileInfo() {
  saveData('portfolio_profile_info', profileInfo);
  updatePortfolioFromProfile();
}

function updatePortfolioFromProfile() {
  // Hero section
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroLocation = document.querySelector('.hero-location');
  const heroIntro = document.querySelector('.hero-intro');
  const aboutText = document.querySelector('.about-text');

  if (heroTitle) heroTitle.textContent = profileInfo.name || 'Qamar Abbas';
  if (heroSubtitle) heroSubtitle.innerHTML = ` ${profileInfo.title || 'Generative AI | eCommerce'}`;
  if (heroLocation) heroLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${profileInfo.location || 'Gilgit-Baltistan, Pakistan'}`;
  if (heroIntro) heroIntro.textContent = profileInfo.shortBio || defaultProfileInfo.shortBio;
  if (aboutText) aboutText.textContent = profileInfo.about || defaultProfileInfo.about;

  // Contact section
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) {
    contactInfo.innerHTML = `
      <i class="fas fa-phone"></i> ${profileInfo.phone || '0347 8094332'}<br>
      <i class="fas fa-envelope"></i> ${profileInfo.email || 'sheikhuqamar@gmail.com'}<br>
      <i class="fas fa-map-marker-alt"></i> ${profileInfo.location || 'Gilgit-Baltistan, Pakistan'}
    `;
  }

  // Footer social links
  const socialContainer = document.querySelector('.social-links');
  if (socialContainer) {
    // Keep existing links structure but update URLs
    const links = socialContainer.querySelectorAll('a');
    const socialMap = {
      'fa-linkedin': profileInfo.social?.linkedin || '#',
      'fa-envelope': `mailto:${profileInfo.email || 'sheikhuqamar@gmail.com'}`,
      'fa-phone': `tel:${profileInfo.phone || '0347 8094332'}`,
      'fa-whatsapp': `https://wa.me/${profileInfo.phone?.replace(/[^0-9]/g, '') || '923478094332'}`,
      'fa-globe': profileInfo.social?.website || '#'
    };
    links.forEach(a => {
      const icon = a.querySelector('i');
      if (icon) {
        for (const [cls, url] of Object.entries(socialMap)) {
          if (icon.classList.contains(cls)) {
            a.href = url;
            break;
          }
        }
      }
    });
  }

  // Footer copyright
  const footerP = document.querySelector('footer p');
  if (footerP && !footerP.querySelector('a')) {
    footerP.textContent = `\u00a9 ${new Date().getFullYear()} ${profileInfo.name || 'Qamar Abbas'}. All rights reserved.`;
  }
}

function loadProfileInfoToForm() {
  document.getElementById('adminName').value = profileInfo.name || '';
  document.getElementById('adminTitle').value = profileInfo.title || '';
  document.getElementById('adminBio').value = profileInfo.shortBio || '';
  document.getElementById('adminAbout').value = profileInfo.about || '';
  document.getElementById('adminEmail').value = profileInfo.email || '';
  document.getElementById('adminPhone').value = profileInfo.phone || '';
  document.getElementById('adminLocation').value = profileInfo.location || '';
  document.getElementById('adminLinkedin').value = profileInfo.social?.linkedin || '';
  document.getElementById('adminGithub').value = profileInfo.social?.github || '';
  document.getElementById('adminWebsite').value = profileInfo.social?.website || '';
}

document.getElementById('saveInfoBtn').addEventListener('click', function() {
  profileInfo = {
    name: document.getElementById('adminName').value.trim(),
    title: document.getElementById('adminTitle').value.trim(),
    shortBio: document.getElementById('adminBio').value.trim(),
    about: document.getElementById('adminAbout').value.trim(),
    email: document.getElementById('adminEmail').value.trim(),
    phone: document.getElementById('adminPhone').value.trim(),
    location: document.getElementById('adminLocation').value.trim(),
    social: {
      linkedin: document.getElementById('adminLinkedin').value.trim(),
      github: document.getElementById('adminGithub').value.trim(),
      website: document.getElementById('adminWebsite').value.trim()
    }
  };
  saveProfileInfo();
  alert('Profile info saved successfully!');
});

// ====== ADMIN PANEL - OPEN/CLOSE ======

// Footer manage link
document.getElementById('footerManageLink').addEventListener('click', function(e) {
  e.preventDefault();
  openAdminPanel();
});

// Improved manage button
const manageBtn = document.getElementById('manageBtn');
manageBtn.title = 'Open Admin Panel';

function openAdminPanel() {
  managePanel.style.display = 'flex';
  // Load current data into forms
  loadProfileInfoToForm();
  renderSkillsList();
  renderProjectsList();
  // Reset to first tab
  document.querySelectorAll('.manage-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.manage-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.manage-tab[data-tab="infoTab"]').classList.add('active');
  document.getElementById('infoTab').classList.add('active');
}

manageBtn.addEventListener('click', openAdminPanel);

// ====== INITIAL RENDER ======
updatePortfolioFromProfile();
renderSkillsGrid();
renderProjectsSection();
