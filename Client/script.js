import { DEFAULT_DATA } from "./default-data.js";

// Aqui guardo las referencias del HTML que voy a usar para navegar, renderizar datos, abrir modales y controlar el modo admin.
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
const projectDetailModal = document.querySelector("#projectDetailModal");
const projectDetailContent = document.querySelector("#projectDetailContent");
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

let siteData = structuredClone(DEFAULT_DATA);
let adminPassword = "";
let isAdmin = false;
let pendingAction = null;
let revealObserver;
const MAX_VIDEO_UPLOAD_SIZE = 7 * 1024 * 1024;

// Estos detalles enriquecen los proyectos principales aunque MongoDB tenga guardada una version antigua sin campos extra.
const PROJECT_DETAIL_FALLBACKS = {
  "gym-system": {
    badge: "Gym System",
    headline: "Centro de mando para membresias, agenda y caja en vivo.",
    overview:
      "Una plataforma pensada para administrar la operacion de un gimnasio desde una interfaz clara: usuarios, membresias, roles y seguimiento quedan organizados en un mismo flujo.",
    video: "/Client/assets/projects/gym-system-demo.mp4",
    metrics: [
      { value: "3", label: "Roles" },
      { value: "24/7", label: "Acceso" },
      { value: "Web", label: "Gestion" },
    ],
    highlights: [
      {
        title: "Roles organizados",
        text: "Admin, miembro y entrenador tienen una experiencia pensada para sus funciones.",
      },
      {
        title: "Membresias",
        text: "Control de planes, estados y procesos importantes para la operacion diaria.",
      },
      {
        title: "Seguimiento claro",
        text: "La informacion queda visible para tomar decisiones y mantener ordenado el sistema.",
      },
    ],
    stack: ["Node.js", "Express.js", "JavaScript", "Tailwind CSS"],
    result:
      "Este proyecto muestra mi capacidad para estructurar un sistema backend con rutas, datos y pantallas conectadas a una experiencia real.",
  },
  "class-manager": {
    badge: "ClassManager",
    headline: "Gestion academica moderna para usuarios, tareas y seguimiento.",
    overview:
      "Aplicacion web enfocada en administradores, profesores y estudiantes, con una experiencia clara para organizar informacion academica y acompanar el aprendizaje.",
    video: "/Client/assets/projects/classmanager-demo.mp4",
    metrics: [
      { value: "3", label: "Roles" },
      { value: "24/7", label: "Acceso" },
      { value: "IA", label: "Apoyo" },
    ],
    highlights: [
      {
        title: "Gestion por roles",
        text: "Cada tipo de usuario entra a una experiencia con funciones pensadas para su necesidad.",
      },
      {
        title: "Aprendizaje real",
        text: "El sistema ayuda a revisar tareas, entregas y avance academico de forma organizada.",
      },
      {
        title: "Interfaz clara",
        text: "La informacion se presenta con orden para que el usuario encuentre rapido lo importante.",
      },
    ],
    stack: ["Node.js", "Express.js", "JavaScript", "HTML5", "Tailwind CSS"],
    result:
      "Este proyecto refleja una solucion completa donde backend, datos y frontend trabajan juntos para un flujo educativo funcional.",
  },
};

// Esta funcion limpia el texto dinamico antes de meterlo en el HTML para evitar inyecciones o etiquetas no deseadas.
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Estos dos proyectos fueron maquetados con Tailwind; si MongoDB trae el dato viejo, aqui lo corrijo al pintar.
function normalizeProjectStack(project, stack = []) {
  const usesTailwind = ["gym-system", "class-manager"].includes(project.id);

  return stack.map((item) => {
    if (usesTailwind && item.toLowerCase() === "css3") return "Tailwind CSS";
    return item;
  });
}

// Aqui se busca el detalle profesional del proyecto; si no existe, se construye una version basica con sus datos.
function getProjectDetail(project) {
  const fallbackKey = Object.keys(PROJECT_DETAIL_FALLBACKS).find(
    (key) => project.id === key || project.name.toLowerCase().replace(/\s+/g, "-") === key
  );
  const fallback = fallbackKey ? PROJECT_DETAIL_FALLBACKS[fallbackKey] : {};
  const projectStack = project.stack || project.detail?.stack || fallback.stack || ["JavaScript", "Backend", "Web"];

  return {
    badge: "Proyecto destacado",
    headline: project.name,
    overview: project.description,
    video: "",
    metrics: [
      { value: "API", label: "Backend" },
      { value: "JS", label: "Logica" },
      { value: "Web", label: "Deploy" },
    ],
    highlights: [
      { title: "Objetivo", text: project.description },
      { title: "Estructura", text: "Proyecto organizado para crecer y seguir mejorando con nuevas funciones." },
      { title: "Aprendizaje", text: "Me ayudo a fortalecer backend, datos, rutas y experiencia de usuario." },
    ],
    stack: ["JavaScript", "Backend", "Web"],
    result: "Proyecto construido para practicar soluciones reales y mostrar una base tecnica funcional.",
    ...fallback,
    ...(project.detail || {}),
    stack: normalizeProjectStack(project, projectStack),
  };
}

// El stack se escribe separado por comas en el formulario y aqui lo convierto en una lista limpia.
function parseStack(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Estas pequenas lecturas evitan repetir nombres largos al llenar o guardar el formulario de proyectos.
function setProjectFormDetail(detail, project) {
  projectForm.elements.badge.value = detail?.badge || project?.name || "Proyecto destacado";
  projectForm.elements.headline.value = detail?.headline || project?.name || "";
  projectForm.elements.overview.value = detail?.overview || project?.description || "";
  projectForm.elements.video.value = detail?.video || "";
  projectForm.elements.videoFile.value = "";
  projectForm.elements.result.value = detail?.result || "";

  for (let index = 0; index < 3; index += 1) {
    projectForm.elements[`metricValue${index}`].value = detail?.metrics?.[index]?.value || "";
    projectForm.elements[`metricLabel${index}`].value = detail?.metrics?.[index]?.label || "";
    projectForm.elements[`highlightTitle${index}`].value = detail?.highlights?.[index]?.title || "";
    projectForm.elements[`highlightText${index}`].value = detail?.highlights?.[index]?.text || "";
  }
}

// Esta funcion centraliza las peticiones fetch a la API y maneja respuestas JSON.
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

// Aqui se cargan desde el servidor los datos editables del portafolio.
async function loadData() {
  try {
    siteData = await apiRequest("/api/data");
  } catch {
    siteData = structuredClone(DEFAULT_DATA);
  }
}

// Esta funcion envia al backend todo el documento actualizado para guardarlo en MongoDB.
async function saveData() {
  await apiRequest("/api/data", {
    method: "PUT",
    body: JSON.stringify({
      password: adminPassword,
      data: siteData,
    }),
  });
}

// Estas funciones pintan en pantalla la informacion que viene de siteData.
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
    .map((project) => {
      const detail = getProjectDetail(project);
      const tags = detail.stack.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="project-card reveal visible" data-project-id="${escapeHtml(project.id)}">
          <div class="project-topline">
            <span>Proyecto</span>
            <a href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">Abrir</a>
          </div>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <ul class="project-tags" aria-label="Tecnologias usadas en ${escapeHtml(project.name)}">
            ${tags}
          </ul>
          <div class="project-card-actions">
            <button class="project-info" type="button" data-project-info="${escapeHtml(project.id)}">Ver mas informacion</button>
            <button class="project-edit" type="button" data-project-edit="${escapeHtml(project.id)}" ${isAdmin ? "" : "hidden"}>Editar</button>
          </div>
        </article>
      `;
    })
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

// Este modal transforma una tarjeta corta en una presentacion completa con video, metricas y puntos clave.
function openProjectDetail(project) {
  const detail = getProjectDetail(project);
  const metrics = detail.metrics
    .map(
      (metric) => `
        <li>
          <strong>${escapeHtml(metric.value)}</strong>
          <span>${escapeHtml(metric.label)}</span>
        </li>
      `
    )
    .join("");
  const highlights = detail.highlights
    .map(
      (highlight) => `
        <article>
          <span>${escapeHtml(highlight.title)}</span>
          <p>${escapeHtml(highlight.text)}</p>
        </article>
      `
    )
    .join("");
  const stack = detail.stack.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  projectDetailContent.innerHTML = `
    <div class="project-detail-hero">
      <div class="project-detail-copy">
        <p class="eyebrow">${escapeHtml(detail.badge)}</p>
        <h2>${escapeHtml(detail.headline)}</h2>
        <p>${escapeHtml(detail.overview)}</p>
        <div class="project-detail-actions">
          <a class="btn primary" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">Abrir proyecto</a>
        </div>
      </div>
      <div class="project-detail-media">
        ${
          detail.video
            ? `<video src="${escapeHtml(detail.video)}" controls muted playsinline preload="metadata"></video>`
            : `<div class="project-detail-placeholder">${escapeHtml(project.name)}</div>`
        }
      </div>
    </div>

    <ul class="project-detail-metrics" aria-label="Datos clave de ${escapeHtml(project.name)}">
      ${metrics}
    </ul>

    <div class="project-detail-grid">
      ${highlights}
    </div>

    <div class="project-detail-bottom">
      <div>
        <span>Resultado</span>
        <p>${escapeHtml(detail.result)}</p>
      </div>
      <ul class="project-detail-stack" aria-label="Stack usado">
        ${stack}
      </ul>
    </div>
  `;

  projectDetailModal.showModal();
}

// Esta funcion activa o desactiva los controles privados de edicion.
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

// Antes de editar, esta funcion verifica si ya estamos en modo admin; si no, pide la contrasena.
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

// Estas funciones abren los modales y rellenan los campos cuando se va a editar algo existente.
function openProjectModal(project) {
  const detail = project
    ? getProjectDetail(project)
    : {
        badge: "Proyecto destacado",
        headline: "",
        overview: "",
        video: "",
        metrics: [
          { value: "API", label: "Backend" },
          { value: "JS", label: "Logica" },
          { value: "Web", label: "Deploy" },
        ],
        highlights: [
          { title: "Objetivo", text: "" },
          { title: "Estructura", text: "" },
          { title: "Aprendizaje", text: "" },
        ],
        result: "",
        stack: ["Node.js", "Express.js", "JavaScript", "Tailwind CSS"],
      };
  projectForm.reset();
  projectForm.elements.projectId.value = project?.id || "";
  projectForm.elements.name.value = project?.name || "";
  projectForm.elements.url.value = project?.url || "";
  projectForm.elements.description.value = project?.description || "";
  projectForm.elements.stack.value = detail?.stack?.join(", ") || "Node.js, Express.js, JavaScript, Tailwind CSS";
  setProjectFormDetail(detail, project);
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

// Esta funcion convierte archivos subidos a texto base64 para poder guardarlos junto con los datos en MongoDB.
function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

// Estas utilidades evitan repetir codigo al leer formularios, crear ids, agregar, editar o eliminar elementos.
function formText(formData, fieldName) {
  return formData.get(fieldName).trim();
}

function createId(prefix) {
  return `${prefix}-${Date.now()}`;
}

function upsertItem(collectionName, itemId, item) {
  if (itemId) {
    siteData[collectionName] = siteData[collectionName].map((currentItem) =>
      currentItem.id === itemId ? item : currentItem
    );
    return;
  }

  siteData[collectionName] = [...siteData[collectionName], item];
}

function deleteItem(collectionName, itemId) {
  siteData[collectionName] = siteData[collectionName].filter((item) => item.id !== itemId);
}

async function persistAndRender() {
  await saveData();
  renderAll();
}

// Interacciones principales del menu y del boton para entrar al modo edicion.
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

// Todos los modales usan este comportamiento comun para cerrarse.
document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

// La contrasena se valida en el backend antes de habilitar las opciones privadas.
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

// Cuando se envia un formulario, se actualiza siteData, se guarda en MongoDB y se vuelve a pintar la pagina.
projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const projectId = formData.get("projectId");
  const stack = parseStack(formData.get("stack"));
  const currentProject = siteData.projects.find((project) => project.id === projectId);
  const currentDetail = currentProject?.detail || {};
  const videoFile = projectForm.elements.videoFile.files[0];
  let video = formText(formData, "video");

  if (videoFile) {
    if (videoFile.size > MAX_VIDEO_UPLOAD_SIZE) {
      alert("El video es muy pesado para guardarlo en MongoDB. Usa un video mas liviano o pega una URL publica del video.");
      return;
    }

    video = await readImageAsDataUrl(videoFile);
  }

  const projectData = {
    id: projectId || createId("project"),
    name: formText(formData, "name"),
    url: formText(formData, "url"),
    description: formText(formData, "description"),
    stack,
    detail: {
      ...currentDetail,
      badge: formText(formData, "badge"),
      headline: formText(formData, "headline"),
      overview: formText(formData, "overview"),
      video,
      metrics: [
        { value: formText(formData, "metricValue0"), label: formText(formData, "metricLabel0") },
        { value: formText(formData, "metricValue1"), label: formText(formData, "metricLabel1") },
        { value: formText(formData, "metricValue2"), label: formText(formData, "metricLabel2") },
      ],
      highlights: [
        { title: formText(formData, "highlightTitle0"), text: formText(formData, "highlightText0") },
        { title: formText(formData, "highlightTitle1"), text: formText(formData, "highlightText1") },
        { title: formText(formData, "highlightTitle2"), text: formText(formData, "highlightText2") },
      ],
      result: formText(formData, "result"),
      stack,
    },
  };

  upsertItem("projects", projectId, projectData);
  await persistAndRender();
  projectModal.close();
});

projectDeleteButton.addEventListener("click", async () => {
  deleteItem("projects", projectForm.elements.projectId.value);
  await persistAndRender();
  projectModal.close();
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const photoFile = profileForm.elements.photo.files[0];
  const photo = photoFile ? await readImageAsDataUrl(photoFile) : siteData.profile.photo;

  siteData.profile = {
    name: formText(formData, "name"),
    initials: formText(formData, "initials"),
    photo,
    specialty: formText(formData, "specialty"),
    hero: formText(formData, "hero"),
    about: formText(formData, "about"),
    location: formText(formData, "location"),
    stats: [
      { title: formText(formData, "statTitle0"), text: formText(formData, "statText0") },
      { title: formText(formData, "statTitle1"), text: formText(formData, "statText1") },
      { title: formText(formData, "statTitle2"), text: formText(formData, "statText2") },
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
    id: skillId || createId("skill"),
    name: formText(formData, "skillName"),
  };

  upsertItem("skills", skillId, skillData);
  await persistAndRender();
  skillModal.close();
});

skillDeleteButton.addEventListener("click", async () => {
  deleteItem("skills", skillForm.elements.skillId.value);
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
    id: educationId || createId("education"),
    label: formText(formData, "label"),
    title: formText(formData, "title"),
    description: formText(formData, "description"),
    url: formText(formData, "url"),
    logo,
  };

  upsertItem("education", educationId, educationData);
  await persistAndRender();
  educationModal.close();
});

educationDeleteButton.addEventListener("click", async () => {
  deleteItem("education", educationForm.elements.educationId.value);
  await persistAndRender();
  educationModal.close();
});

learningTechForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(learningTechForm);
  const techId = formData.get("techId");
  const techData = {
    id: techId || createId("learning-tech"),
    name: formText(formData, "techName"),
    description: formText(formData, "techDescription"),
  };

  upsertItem("learningTech", techId, techData);
  await persistAndRender();
  learningTechModal.close();
});

learningTechDeleteButton.addEventListener("click", async () => {
  deleteItem("learningTech", learningTechForm.elements.techId.value);
  await persistAndRender();
  learningTechModal.close();
});

// Uso delegacion de eventos porque las tarjetas se crean dinamicamente despues de cargar los datos.
projectsGrid.addEventListener("click", (event) => {
  const infoButton = event.target.closest("[data-project-info]");
  if (infoButton) {
    const project = siteData.projects.find((item) => item.id === infoButton.dataset.projectInfo);
    if (project) openProjectDetail(project);
    return;
  }

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

// Este observador marca en el menu la seccion que el usuario esta viendo.
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

// Secuencia inicial: observa secciones, carga datos, pinta contenido y activa animaciones de entrada.
async function init() {
  sections.forEach((section) => sectionObserver.observe(section));
  await loadData();
  renderAll();
  setupRevealAnimations();
}

init();
