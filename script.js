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

let projectsData = loadData('portfolio_projects', []);
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
    if (projectsData.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    projectsData.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'skill-card project-card';
        card.style.transitionDelay = `${index * 0.1}s`;
        const techHtml = proj.technologies ? proj.technologies.split(',').map(t => `<span>${escapeHtml(t.trim())}</span>`).join('') : '';
        card.innerHTML = `
            ${proj.image ? `<img src="${proj.image}" alt="${escapeHtml(proj.title)}">` : '<div style="height:200px;background:#f0f0ff;border-radius:15px;margin-bottom:15px;display:flex;align-items:center;justify-content:center;color:#667eea;font-size:3rem;"><i class="fas fa-code"></i></div>'}
            <h3>${escapeHtml(proj.title)}</h3>
            ${proj.description ? `<p>${escapeHtml(proj.description)}</p>` : ''}
            ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ''}
            <div class="project-links">
                ${proj.github ? `<a href="${escapeHtml(proj.github)}" target="_blank" style="background:#333;color:white;"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${proj.demo ? `<a href="${escapeHtml(proj.demo)}" target="_blank" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            </div>
        `;
        grid.appendChild(card);
        observer.observe(card);
    });
}

function renderProjectsList() {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';
    if (projectsData.length === 0) {
        list.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">No projects yet. Add your first project above.</p>';
        return;
    }
    projectsData.forEach(proj => {
        const item = document.createElement('div');
        item.className = 'manage-list-item';
        item.innerHTML = `
            <div class="item-info">
                <h4>${escapeHtml(proj.title)}</h4>
                <p>${proj.technologies || 'No technologies'}</p>
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

const manageBtn = document.getElementById('manageBtn');
const managePanel = document.getElementById('managePanel');
const closePanel = document.getElementById('closePanel');

manageBtn.addEventListener('click', function() {
    managePanel.style.display = 'flex';
    renderSkillsList();
    renderProjectsList();
});

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

// ====== INITIAL RENDER ======
renderSkillsGrid();
renderProjectsSection();
