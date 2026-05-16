// Datos iniciales del portafolio cuando MongoDB todavia no tiene informacion guardada.
// El backend y el frontend importan este archivo para no duplicar los datos por defecto.
export const DEFAULT_DATA = {
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
      stack: ["Node.js", "Express.js", "JavaScript", "Tailwind CSS"],
      detail: {
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
    },
    {
      id: "class-manager",
      name: "Class Manager",
      url: "https://classmanager-r062.onrender.com",
      description:
        "Aplicacion para administrar informacion academica y organizar recursos de clase con una experiencia web clara y practica.",
      stack: ["Node.js", "Express.js", "JavaScript", "HTML5", "Tailwind CSS"],
      detail: {
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
      logoLight: "assets/devsenior-logo-dark.svg",
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
