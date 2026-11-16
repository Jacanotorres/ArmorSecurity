/* =========================================================
   Armor Security — acceso a los datos (Supabase)
   Cuando hay base de datos, el catálogo se lee de ahí (y se administra
   desde panel.html). Sin base, el sitio usa VEHICULOS de data.js.
   ========================================================= */

/* Convierte una fila de "vehicles" (+ sus vehicle_photos) al objeto que
   usan main.js y el panel. */
function normalizeVehicle(row){
  const fotos = (row.vehicle_photos || [])
    .slice()
    .sort(function(a, b){ return a.posicion - b.posicion; })
    .map(function(p){ return p.url; });
  const modalidades = [];
  if(row.en_venta) modalidades.push("venta");
  if(row.en_alquiler) modalidades.push("alquiler");
  return {
    id: row.id,
    ref: "AS-" + String(row.numero || 0).padStart(3, "0"),
    marca: row.marca,
    linea: row.linea,
    anio: row.anio,
    tipo: row.tipo,
    nivel: row.nivel,
    modalidades: modalidades,
    precioVenta: row.precio_venta,
    tarifas: { dia: row.tarifa_dia, semana: row.tarifa_semana, mes: row.tarifa_mes },
    color: row.color || "",
    transmision: row.transmision || "",
    combustible: row.combustible || "",
    cilindraje: row.cilindraje || "",
    pasajeros: row.pasajeros,
    descripcion: row.descripcion || "",
    destacado: !!row.destacado,
    estado: row.estado || "disponible",
    fotos: fotos
  };
}

/* El catálogo se pide una sola vez por carga de página. El panel pasa
   force=true para ver los cambios al instante y includeHidden=true para
   incluir los vehículos "ocultos" (solo lo usa el panel; un administrador con
   la sesión abierta no debe ver los ocultos al navegar el sitio público). */
let vehiclesPromise = null;
function fetchVehicles(force, includeHidden){
  if(!supabaseClient) return Promise.resolve(null);
  if(!vehiclesPromise || force){
    vehiclesPromise = (async function(){
      const { data, error } = await supabaseClient
        .from("vehicles")
        .select("*, vehicle_photos(url, posicion)")
        .order("numero", { ascending: false });
      if(error){
        console.error("Error cargando el catálogo:", error);
        return [];
      }
      return data.map(normalizeVehicle).filter(function(v){ return includeHidden || v.estado !== "oculto"; });
    })();
  }
  return vehiclesPromise;
}
