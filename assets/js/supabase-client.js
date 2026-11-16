/* Conexión con Supabase. La "llave pública" es segura de exponer aquí:
   lo que puede hacer está limitado por las políticas de seguridad de
   supabase-instalar.sql (el público solo ve el catálogo y envía solicitudes).

   Armor Security necesita su PROPIO proyecto de Supabase (nunca la URL ni la
   llave de otro cliente: sus solicitudes y vehículos terminarían en esa base).
   Mientras estas dos constantes estén vacías, el sitio funciona sin base de
   datos y muestra los vehículos de muestra de data.js. */
const SUPABASE_URL = "";
const SUPABASE_PUBLIC_KEY = "";

const supabaseClient = (SUPABASE_URL && SUPABASE_PUBLIC_KEY && typeof supabase !== "undefined")
  ? supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)
  : null;
