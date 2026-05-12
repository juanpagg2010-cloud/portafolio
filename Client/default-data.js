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
