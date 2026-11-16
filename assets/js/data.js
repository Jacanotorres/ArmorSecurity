/* ============================================================
   ARMOR SECURITY — datos del sitio y catálogo
   Todo lo que está vacío ("" o null) se oculta solo en el sitio.
   ============================================================ */

const SITE = {
  nombre: "Armor Security",
  lema: "Blindaje vehicular · Venta, alquiler y escoltas",
  whatsapp: "573183535315",   // con indicativo de país
  telefono: "+57 318 353 5315",   // texto tal como se quiere mostrar
  correo: "",
  ciudad: "",
  direccion: "",
  horario: "",
  instagram: "armorsecurityblin",  // usuario sin @
  facebook: "",
  tiktok: "",
  linkedin: ""
};

/* Niveles de blindaje que maneja Armor Security. En el panel también se puede
   escribir otro tipo manualmente ("Otro"). El nivel exacto y su certificación
   se indican en la ficha de cada vehículo. */
const NIVELES = [
  {
    id: "2",
    titulo: "Nivel 2",
    resumen: "Protección contra armas cortas",
    detalle: "El nivel base de nuestro blindaje, pensado para el uso diario y los traslados urbanos.",
    uso: "Uso diario y traslados urbanos."
  },
  {
    id: "2 plus",
    titulo: "Nivel 2 Plus",
    resumen: "Protección reforzada",
    detalle: "Un escalón por encima del nivel 2, con mayor resistencia para quien tiene más exposición.",
    uso: "Uso ejecutivo y desplazamientos con mayor exposición."
  },
  {
    id: "3",
    titulo: "Nivel 3",
    resumen: "Mayor nivel de protección",
    detalle: "El nivel más alto de nuestro blindaje, para escenarios de mayor riesgo.",
    uso: "Riesgo alto y desplazamientos por carretera."
  }
];

/* Periodos de alquiler que se muestran en el sitio */
const PERIODOS = [
  { id: "dia", titulo: "Por día", texto: "Traslados puntuales, reuniones, eventos y visitas." },
  { id: "semana", titulo: "Por semana", texto: "Viajes de negocios, comitivas y agendas largas." },
  { id: "mes", titulo: "Por mes", texto: "Estancias prolongadas o mientras llega tu vehículo." },
  { id: "medida", titulo: "A la medida", texto: "Temporadas, conductor, escolta y flotas completas." }
];

/* Misión, visión y principios (borrador para aprobar con el cliente) */
const NOSOTROS = {
  mision: "Proteger la vida de nuestros clientes y sus familias. Ponemos a su servicio vehículos blindados en venta y alquiler, y hombres de protección, con seriedad, discreción y respuesta oportuna en cada servicio.",
  vision: "Ser la empresa de referencia en movilidad protegida en Colombia, reconocida por la confianza de nuestros clientes, la claridad de nuestro servicio y el cumplimiento de lo que prometemos.",
  principios: [
    { titulo: "Seguridad", texto: "La protección de las personas es lo primero en cada vehículo que entregamos y en cada esquema que armamos." },
    { titulo: "Confianza", texto: "Información clara sobre el nivel de blindaje, las condiciones y los precios, y cumplimiento de lo acordado." },
    { titulo: "Discreción", texto: "Tratamos con total reserva los datos, las rutinas y los desplazamientos de quienes confían en nosotros." }
  ]
};

/* Servicio de escoltas (hombres de protección) */
const ESCOLTAS = [
  { tag: "Esquema individual", titulo: "Un escolta", texto: "Un hombre de protección que te acompaña en tus desplazamientos, reuniones y eventos." },
  { tag: "Esquema de equipo", titulo: "Varios escoltas", texto: "Equipos de dos o más hombres para comitivas, directivos, familias y agendas de alto riesgo." },
  { tag: "Con armas", titulo: "Escoltas armados", texto: "Personal armado cuando el nivel de riesgo y la normativa vigente lo permiten." },
  { tag: "Sin armas", titulo: "Escoltas no armados", texto: "Protección y acompañamiento discreto, sin armas, para entornos de menor exposición." }
];

/* ---------- CATÁLOGO ----------
   modalidades: ["venta"], ["alquiler"] o ambas.
   precioVenta: número en pesos o null ("Consultar").
   tarifas: { dia, semana, mes } números o null ("Consultar").
   fotos: lista de rutas, ej. ["assets/img/vehiculos/as-001-1.webp"].
          Sin fotos se muestra una silueta de referencia.
   ejemplo: true marca la unidad como dato de muestra (borrar al cargar las reales). */
const VEHICULOS = [
  {
    id: "as-001", ref: "AS-001",
    marca: "Toyota", linea: "Land Cruiser 300", anio: 2023, tipo: "SUV",
    nivel: "3", modalidades: ["venta"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Diésel", cilindraje: "3.3 L",
    pasajeros: 5, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo: origen del blindaje, materiales, accesorios y estado."
  },
  {
    id: "as-002", ref: "AS-002",
    marca: "Toyota", linea: "Prado TXL", anio: 2022, tipo: "SUV",
    nivel: "2 plus", modalidades: ["venta", "alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Gris", transmision: "Automática", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 7, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-003", ref: "AS-003",
    marca: "Chevrolet", linea: "Suburban", anio: 2021, tipo: "SUV",
    nivel: "2 plus", modalidades: ["alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Gasolina", cilindraje: "5.3 L",
    pasajeros: 7, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-004", ref: "AS-004",
    marca: "Toyota", linea: "Hilux", anio: 2022, tipo: "Camioneta",
    nivel: "2", modalidades: ["venta"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Blanco", transmision: "Automática", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 5, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-005", ref: "AS-005",
    marca: "Mercedes-Benz", linea: "Clase E", anio: 2020, tipo: "Sedán",
    nivel: "3", modalidades: ["venta", "alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Gasolina", cilindraje: "2.0 L",
    pasajeros: 5, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-006", ref: "AS-006",
    marca: "Toyota", linea: "Hiace", anio: 2022, tipo: "Van",
    nivel: "2", modalidades: ["alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Blanco", transmision: "Manual", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 10, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  }
];
