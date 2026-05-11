const fallbackData = {
  profile: {
    name: "Juan Pablo Barragan Cortes",
    initials: "JP",
    photo: "",
    specialty: "JavaScript Backend",
    hero:
      "Construyo la logica detras de cada aplicacion: APIs seguras, bases de datos eficientes y sistemas backend escalables que hacen que todo funcione.",
    about:
      "Soy un desarrollador web especializado en el backend con JavaScript. Me enfoco en tecnologias como Node.js, Express, HTML y CSS, aunque mi principal fortaleza es el desarrollo backend.",
    location:
      "Soy de Colombia, Ibague - Tolima, y desde ahi estoy construyendo mi camino en el desarrollo web con enfoque en soluciones backend.",
    stats: [
      { title: "Node.js", text: "Runtime principal" },
      { title: "Express.js", text: "APIs y rutas" },
      { title: "DevSenior Code", text: "Formacion actual" },
    ],
  },
  skills: [
    { id: "skill-0", name: "HTML5" },
    { id: "skill-1", name: "CSS3" },
    { id: "skill-2", name: "Tailwind CSS" },
    { id: "skill-3", name: "JavaScript Vanilla" },
    { id: "skill-4", name: "Node.js" },
    { id: "skill-5", name: "Express.js" },
  ],
  projects: [
    {
      id: "gym-system",
      name: "Gym System",
      url: "https://gym-system-cxnq.onrender.com",
      description:
        "Sistema web orientado a la gestion de procesos para un gimnasio, con enfoque en estructura backend, rutas y flujo de datos.",
    },
    {
      id: "class-manager",
      name: "Class Manager",
      url: "https://classmanager-r062.onrender.com",
      description:
        "Aplicacion para administrar informacion academica y organizar recursos de clase con una experiencia web clara y practica.",
    },
  ],
  education: [
    {
      id: "devsenior",
      label: "Formacion actual",
      title: "DevSenior Code",
      description:
        "Actualmente estoy estudiando JavaScript y desarrollo web para crear soluciones backend mas limpias, robustas y profesionales.",
      url: "https://www.devseniorcode.com/nosotros/",
      logo: "assets/devsenior-logo.webp",
    },
    {
      id: "fps",
      label: "Institucion educativa",
      title: "Colegio Francisco de Paula Santander",
      description:
        "Parte de mi formacion academica viene de esta institucion educativa, ubicada en Ibague, Tolima.",
      url: "https://www.iefranciscodepaulasantander.edu.co",
      logo: "assets/francisco-de-paula-santander-logo.jpg",
    },
  ],
  learningTech: [
    {
      id: "mongo-db",
      name: "MongoDB",
      description: "Estoy fortaleciendo el manejo de bases de datos NoSQL para conectar mejor mis APIs.",
    },
    {
      id: "typescript",
      name: "TypeScript",
      description: "Estoy aprendiendo tipado para escribir codigo JavaScript mas claro, estable y mantenible.",
    },
    {
      id: "testing",
      name: "Testing Backend",
      description: "Estoy practicando pruebas para validar endpoints, errores y comportamientos del servidor.",
    },
  ],
};

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("section[id]");
const projectsGrid = document.querySelector("#projectsGrid");
const skillsGrid = document.querySelector("#skillsGrid");
const educationGrid = document.querySelector("#educationGrid");
const learningTechGrid = document.querySelector("#learningTechGrid");
const adminOpenButtons = document.querySelectorAll("[data-admin-open]");
const adminOnlyElements = document.querySelectorAll("[data-admin-only]");
const adminPanel = document.querySelector("[data-admin-panel]");
const passwordModal = document.querySelector("#passwordModal");
const passwordForm = document.querySelector("#passwordForm");
const projectModal = document.querySelector("#projectModal");
const projectForm = document.querySelector("#projectForm");
const profileModal = document.querySelector("#profileModal");
const profileForm = document.querySelector("#profileForm");
const skillModal = document.querySelector("#skillModal");
const skillForm = document.querySelector("#skillForm");
const educationModal = document.querySelector("#educationModal");
const educationForm = document.querySelector("#educationForm");
const learningTechModal = document.querySelector("#learningTechModal");
const learningTechForm = document.querySelector("#learningTechForm");
const passwordMessage = document.querySelector("[data-password-message]");
const projectMode = document.querySelector("[data-project-mode]");
const projectDeleteButton = document.querySelector("[data-project-delete]");
const skillMode = document.querySelector("[data-skill-mode]");
const skillDeleteButton = document.querySelector("[data-skill-delete]");
const educationMode = document.querySelector("[data-education-mode]");
const educationDeleteButton = document.querySelector("[data-education-delete]");
const learningTechMode = document.querySelector("[data-learning-tech-mode]");
const learningTechDeleteButton = document.querySelector("[data-learning-tech-delete]");
const photoRemoveButton = document.querySelector("[data-photo-remove]");

let siteData = structuredClone(fallbackData);
let adminPassword = "";
let isAdmin = false;
let pendingAction = null;
let revealObserver;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function loadData() {
  try {
    siteData = await apiRequest("/api/data");
  } catch {
    siteData = structuredClone(fallbackData);
  }
}

async function saveData() {
  await apiRequest("/api/data", {
    method: "PUT",
    body: JSON.stringify({
      password: adminPassword,
      data: siteData,
    }),
  });
}

function renderSkills() {
  skillsGrid.innerHTML = siteData.skills
    .map(
      (skill) => `
        <li>
          <span>${escapeHtml(skill.name)}</span>
          <button class="skill-edit" type="button" data-skill-edit="${escapeHtml(skill.id)}" ${isAdmin ? "" : "hidden"}>Editar</button>
        </li>
      `
    )
    .join("");
}

function renderProjects() {
  projectsGrid.innerHTML = siteData.projects
    .map(
      (project) => `
        <article class="project-card reveal visible" data-project-id="${escapeHtml(project.id)}">
          <div class="project-topline">
            <span>Proyecto</span>
            <a href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">Abrir</a>
          </div>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <ul class="project-tags" aria-label="Tecnologias usadas en ${escapeHtml(project.name)}">
            <li>Backend</li>
            <li>JavaScript</li>
            <li>Web</li>
          </ul>
          <button class="project-edit" type="button" data-project-edit="${escapeHtml(project.id)}" ${isAdmin ? "" : "hidden"}>Editar</button>
        </article>
      `
    )
    .join("");
}

function renderEducation() {
  educationGrid.innerHTML = siteData.education
    .map(
      (item) => `
        <article class="education-card reveal visible" data-education-id="${escapeHtml(item.id)}">
          <a class="education-card-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
            <div class="education-logo">
              <img src="${escapeHtml(item.logo)}" alt="Logo de ${escapeHtml(item.title)}">
            </div>
            <div>
              <span>${escapeHtml(item.label)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </div>
          </a>
          <button class="education-edit" type="button" data-education-edit="${escapeHtml(item.id)}" ${isAdmin ? "" : "hidden"}>Editar</button>
        </article>
      `
    )
    .join("");
}

function renderLearningTech() {
  learningTechGrid.innerHTML = siteData.learningTech
    .map(
      (tech, index) => `
        <li>
          <div>
            <span class="tech-index">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(tech.name)}</h3>
            <p>${escapeHtml(tech.description)}</p>
          </div>
          <button class="learning-tech-edit" type="button" data-learning-tech-edit="${escapeHtml(tech.id)}" ${isAdmin ? "" : "hidden"}>Editar</button>
        </li>
      `
    )
    .join("");
}

function renderProfile() {
  const profile = siteData.profile;
  const nameElement = document.querySelector("[data-profile-name]");
  const heroElement = document.querySelector("[data-profile-hero]");
  const aboutElement = document.querySelector("[data-profile-about]");
  const locationElement = document.querySelector("[data-profile-location]");
  const footerElement = document.querySelector("[data-profile-footer]");
  const initialsElement = document.querySelector("[data-profile-initials]");
  const photoElement = document.querySelector("[data-profile-photo]");
  const specialtyElement = document.querySelector("[data-profile-specialty]");
  const statTitleElements = document.querySelectorAll("[data-stat-title]");
  const statTextElements = document.querySelectorAll("[data-stat-text]");

  nameElement.textContent = profile.name;
  heroElement.textContent = profile.hero;
  aboutElement.textContent = profile.about;
  locationElement.textContent = profile.location;
  footerElement.textContent = `${profile.name} - Colombia, Tolima-Ibague`;
  initialsElement.textContent = profile.initials;
  initialsElement.hidden = Boolean(profile.photo);
  photoElement.hidden = !profile.photo;
  photoElement.src = profile.photo || "";
  specialtyElement.textContent = profile.specialty;
  statTitleElements.forEach((element) => {
    element.textContent = profile.stats[Number(element.dataset.statTitle)]?.title || "";
  });
  statTextElements.forEach((element) => {
    element.textContent = profile.stats[Number(element.dataset.statText)]?.text || "";
  });
}

function renderAll() {
  renderProfile();
  renderSkills();
  renderProjects();
  renderEducation();
  renderLearningTech();
}

function setAdminMode(value) {
  isAdmin = value;
  document.body.classList.toggle("admin-active", isAdmin);
  adminOnlyElements.forEach((element) => {
    element.hidden = !isAdmin;
  });

  if (isAdmin) {
    adminPanel.hidden = false;
    adminPanel.classList.remove("is-leaving");
  } else {
    adminPanel.classList.add("is-leaving");
    window.setTimeout(() => {
      adminPanel.hidden = true;
      adminPanel.classList.remove("is-leaving");
    }, 280);
    adminPassword = "";
  }

  renderAll();
}

function requestPassword(action) {
  if (isAdmin) {
    action();
    return;
  }

  pendingAction = action;
  passwordMessage.textContent = "";
  passwordForm.reset();
  passwordModal.showModal();
}

function openProjectModal(project) {
  projectForm.reset();
  projectForm.elements.projectId.value = project?.id || "";
  projectForm.elements.name.value = project?.name || "";
  projectForm.elements.url.value = project?.url || "";
  projectForm.elements.description.value = project?.description || "";
  projectMode.textContent = project ? "Editar proyecto" : "Agregar proyecto";
  projectDeleteButton.hidden = !project;
  projectModal.showModal();
}

function openProfileModal() {
  const profile = siteData.profile;
  profileForm.elements.name.value = profile.name;
  profileForm.elements.hero.value = profile.hero;
  profileForm.elements.about.value = profile.about;
  profileForm.elements.location.value = profile.location;
  profileForm.elements.initials.value = profile.initials;
  profileForm.elements.specialty.value = profile.specialty;
  profileForm.elements.photo.value = "";
  photoRemoveButton.hidden = !profile.photo;
  profile.stats.forEach((stat, index) => {
    profileForm.elements[`statTitle${index}`].value = stat.title;
    profileForm.elements[`statText${index}`].value = stat.text;
  });
  profileModal.showModal();
}

function openSkillModal(skill) {
  skillForm.reset();
  skillForm.elements.skillId.value = skill?.id || "";
  skillForm.elements.skillName.value = skill?.name || "";
  skillMode.textContent = skill ? "Editar habilidad" : "Agregar habilidad";
  skillDeleteButton.hidden = !skill;
  skillModal.showModal();
}

function openEducationModal(item) {
  educationForm.reset();
  educationForm.elements.educationId.value = item?.id || "";
  educationForm.elements.currentLogo.value = item?.logo || "";
  educationForm.elements.label.value = item?.label || "";
  educationForm.elements.title.value = item?.title || "";
  educationForm.elements.description.value = item?.description || "";
  educationForm.elements.url.value = item?.url || "";
  educationMode.textContent = item ? "Editar formacion" : "Agregar formacion";
  educationDeleteButton.hidden = !item;
  educationModal.showModal();
}

function openLearningTechModal(tech) {
  learningTechForm.reset();
  learningTechForm.elements.techId.value = tech?.id || "";
  learningTechForm.elements.techName.value = tech?.name || "";
  learningTechForm.elements.techDescription.value = tech?.description || "";
  learningTechMode.textContent = tech ? "Editar tecnologia" : "Agregar tecnologia";
  learningTechDeleteButton.hidden = !tech;
  learningTechModal.showModal();
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(element);
  });
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

async function persistAndRender() {
  await saveData();
  renderAll();
}

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

adminOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.remove("is-unlocking");
    void button.offsetWidth;
    button.classList.add("is-unlocking");
    requestPassword(() => setAdminMode(true));
  });
});

document.querySelectorAll("[data-project-add]").forEach((button) => {
  button.addEventListener("click", () => requestPassword(() => openProjectModal()));
});

document.querySelectorAll("[data-skill-add]").forEach((button) => {
  button.addEventListener("click", () => requestPassword(() => openSkillModal()));
});

document.querySelectorAll("[data-education-add]").forEach((button) => {
  button.addEventListener("click", () => requestPassword(() => openEducationModal()));
});

document.querySelectorAll("[data-learning-tech-add]").forEach((button) => {
  button.addEventListener("click", () => requestPassword(() => openLearningTechModal()));
});

document.querySelector("[data-profile-edit]").addEventListener("click", () => {
  requestPassword(openProfileModal);
});

document.querySelector("[data-admin-logout]").addEventListener("click", () => setAdminMode(false));

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = passwordForm.elements.password.value;

  try {
    await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    adminPassword = password;
    setAdminMode(true);
    passwordModal.close();
    pendingAction?.();
    pendingAction = null;
  } catch {
    passwordMessage.textContent = "Contrasena incorrecta.";
  }
});

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const projectId = formData.get("projectId");
  const projectData = {
    id: projectId || `project-${Date.now()}`,
    name: formData.get("name").trim(),
    url: formData.get("url").trim(),
    description: formData.get("description").trim(),
  };

  if (projectId) {
    siteData.projects = siteData.projects.map((project) => (project.id === projectId ? projectData : project));
  } else {
    siteData.projects = [...siteData.projects, projectData];
  }

  await persistAndRender();
  projectModal.close();
});

projectDeleteButton.addEventListener("click", async () => {
  const projectId = projectForm.elements.projectId.value;
  siteData.projects = siteData.projects.filter((project) => project.id !== projectId);
  await persistAndRender();
  projectModal.close();
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const photoFile = profileForm.elements.photo.files[0];
  const photo = photoFile ? await readImageAsDataUrl(photoFile) : siteData.profile.photo;

  siteData.profile = {
    name: formData.get("name").trim(),
    initials: formData.get("initials").trim(),
    photo,
    specialty: formData.get("specialty").trim(),
    hero: formData.get("hero").trim(),
    about: formData.get("about").trim(),
    location: formData.get("location").trim(),
    stats: [
      { title: formData.get("statTitle0").trim(), text: formData.get("statText0").trim() },
      { title: formData.get("statTitle1").trim(), text: formData.get("statText1").trim() },
      { title: formData.get("statTitle2").trim(), text: formData.get("statText2").trim() },
    ],
  };

  await persistAndRender();
  profileModal.close();
});

photoRemoveButton.addEventListener("click", async () => {
  siteData.profile = { ...siteData.profile, photo: "" };
  await persistAndRender();
  photoRemoveButton.hidden = true;
  profileForm.elements.photo.value = "";
});

skillForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(skillForm);
  const skillId = formData.get("skillId");
  const skillData = {
    id: skillId || `skill-${Date.now()}`,
    name: formData.get("skillName").trim(),
  };

  if (skillId) {
    siteData.skills = siteData.skills.map((skill) => (skill.id === skillId ? skillData : skill));
  } else {
    siteData.skills = [...siteData.skills, skillData];
  }

  await persistAndRender();
  skillModal.close();
});

skillDeleteButton.addEventListener("click", async () => {
  const skillId = skillForm.elements.skillId.value;
  siteData.skills = siteData.skills.filter((skill) => skill.id !== skillId);
  await persistAndRender();
  skillModal.close();
});

educationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(educationForm);
  const educationId = formData.get("educationId");
  const logoFile = educationForm.elements.logo.files[0];
  const logo = logoFile ? await readImageAsDataUrl(logoFile) : formData.get("currentLogo");
  const educationData = {
    id: educationId || `education-${Date.now()}`,
    label: formData.get("label").trim(),
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    url: formData.get("url").trim(),
    logo,
  };

  if (educationId) {
    siteData.education = siteData.education.map((item) => (item.id === educationId ? educationData : item));
  } else {
    siteData.education = [...siteData.education, educationData];
  }

  await persistAndRender();
  educationModal.close();
});

educationDeleteButton.addEventListener("click", async () => {
  const educationId = educationForm.elements.educationId.value;
  siteData.education = siteData.education.filter((item) => item.id !== educationId);
  await persistAndRender();
  educationModal.close();
});

learningTechForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(learningTechForm);
  const techId = formData.get("techId");
  const techData = {
    id: techId || `learning-tech-${Date.now()}`,
    name: formData.get("techName").trim(),
    description: formData.get("techDescription").trim(),
  };

  if (techId) {
    siteData.learningTech = siteData.learningTech.map((tech) => (tech.id === techId ? techData : tech));
  } else {
    siteData.learningTech = [...siteData.learningTech, techData];
  }

  await persistAndRender();
  learningTechModal.close();
});

learningTechDeleteButton.addEventListener("click", async () => {
  const techId = learningTechForm.elements.techId.value;
  siteData.learningTech = siteData.learningTech.filter((tech) => tech.id !== techId);
  await persistAndRender();
  learningTechModal.close();
});

projectsGrid.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-project-edit]");
  if (!editButton) return;

  const project = siteData.projects.find((item) => item.id === editButton.dataset.projectEdit);
  if (project) requestPassword(() => openProjectModal(project));
});

educationGrid.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-education-edit]");
  if (!editButton) return;

  const item = siteData.education.find((education) => education.id === editButton.dataset.educationEdit);
  if (item) requestPassword(() => openEducationModal(item));
});

learningTechGrid.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-learning-tech-edit]");
  if (!editButton) return;

  const tech = siteData.learningTech.find((item) => item.id === editButton.dataset.learningTechEdit);
  if (tech) requestPassword(() => openLearningTechModal(tech));
});

skillsGrid.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-skill-edit]");
  if (!editButton) return;

  const skill = siteData.skills.find((item) => item.id === editButton.dataset.skillEdit);
  if (skill) requestPassword(() => openSkillModal(skill));
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
  }
);

async function init() {
  sections.forEach((section) => sectionObserver.observe(section));
  await loadData();
  renderAll();
  setupRevealAnimations();
}

init();
