/* ============================================================
   ARMOR SECURITY — datos del sitio y catálogo
   Todo lo que está vacío ("" o null) se oculta solo en el sitio.
   ============================================================ */

const SITE = {
  nombre: "Armor Security",
  lema: "Blindaje vehicular · Venta y alquiler",
  whatsapp: "",   // ej: "573001234567" (con indicativo de país)
  telefono: "",   // texto tal como se quiere mostrar
  correo: "",
  ciudad: "",
  direccion: "",
  horario: "",
  instagram: "",  // usuario sin @
  facebook: "",
  tiktok: "",
  linkedin: ""
};

/* Niveles de blindaje (referencia general; el nivel real y su
   certificación se indican en la ficha de cada vehículo). */
const NIVELES = [
  {
    id: "III-A",
    titulo: "Nivel III-A",
    resumen: "Protección contra armas cortas",
    detalle: "Resiste disparos de armas de mano de alto calibre, incluidos .44 Magnum. Es el nivel más usado en vehículos de uso ejecutivo y familiar."
  },
  {
    id: "III",
    titulo: "Nivel III",
    resumen: "Protección contra fusiles",
    detalle: "Resiste disparos de fusil de 7,62 mm con munición de camisa completa. Para escenarios de riesgo alto."
  },
  {
    id: "IV",
    titulo: "Nivel IV",
    resumen: "Protección contra munición perforante",
    detalle: "Resiste munición de fusil perforante .30-06. El mayor nivel de protección civil, con más peso y blindaje en todo el habitáculo."
  }
];

/* Periodos de alquiler que se muestran en el sitio */
const PERIODOS = [
  { id: "dia", titulo: "Por día", texto: "Traslados puntuales, reuniones, eventos y visitas." },
  { id: "semana", titulo: "Por semana", texto: "Viajes de negocios, comitivas y agendas largas." },
  { id: "mes", titulo: "Por mes", texto: "Estancias prolongadas o mientras llega tu vehículo." },
  { id: "medida", titulo: "A la medida", texto: "Temporadas, conductor, escolta y flotas completas." }
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
    nivel: "IV", modalidades: ["venta"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Diésel", cilindraje: "3.3 L",
    pasajeros: 5, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo: origen del blindaje, materiales, accesorios y estado."
  },
  {
    id: "as-002", ref: "AS-002",
    marca: "Toyota", linea: "Prado TXL", anio: 2022, tipo: "SUV",
    nivel: "III-A", modalidades: ["venta", "alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Gris", transmision: "Automática", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 7, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-003", ref: "AS-003",
    marca: "Chevrolet", linea: "Suburban", anio: 2021, tipo: "SUV",
    nivel: "III-A", modalidades: ["alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Gasolina", cilindraje: "5.3 L",
    pasajeros: 7, fotos: [], destacado: true, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-004", ref: "AS-004",
    marca: "Toyota", linea: "Hilux", anio: 2022, tipo: "Camioneta",
    nivel: "III-A", modalidades: ["venta"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Blanco", transmision: "Automática", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 5, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-005", ref: "AS-005",
    marca: "Mercedes-Benz", linea: "Clase E", anio: 2020, tipo: "Sedán",
    nivel: "III", modalidades: ["venta", "alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Negro", transmision: "Automática", combustible: "Gasolina", cilindraje: "2.0 L",
    pasajeros: 5, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  },
  {
    id: "as-006", ref: "AS-006",
    marca: "Toyota", linea: "Hiace", anio: 2022, tipo: "Van",
    nivel: "III-A", modalidades: ["alquiler"],
    precioVenta: null, tarifas: { dia: null, semana: null, mes: null },
    color: "Blanco", transmision: "Manual", combustible: "Diésel", cilindraje: "2.8 L",
    pasajeros: 10, fotos: [], destacado: false, ejemplo: true,
    descripcion: "Ficha de muestra. Aquí va la descripción real del vehículo."
  }
];
