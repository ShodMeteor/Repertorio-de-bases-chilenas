import { useMemo, useState } from "react";

const datasets = [
  {
    id: "paes-2025",
    nombre: "PAES 2025",
    area: "Educación",
    icono: "🎓",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "t-test", "ANOVA", "Correlación"],
    fuenteNombre: "Agencia de Calidad de la Educación",
    descripcion:
      "Resultados de estudiantes en Matemática, Competencia Lectora, NEM, Ranking y variables del establecimiento.",
    contexto:
      "Esta base permite estudiar diferencias de rendimiento entre tipos de colegio y regiones, además de explorar la relación entre antecedentes escolares y puntajes PAES.",
    tecnicas: [
      "Histogramas",
      "Boxplots por tipo de colegio",
      "Gráficos de dispersión",
      "t-test",
      "ANOVA regional",
    ],
    preguntas: [
      "¿Existen diferencias entre colegios municipales y particulares pagados?",
      "¿Existen diferencias regionales en los puntajes?",
      "¿Qué relación hay entre NEM y PAES?",
    ],
    variables: [
      "MATE1_REG_ACTUAL",
      "CLEC_REG_ACTUAL",
      "PTJE_NEM",
      "PTJE_RANKING",
      "PROMEDIO_NOTAS",
      "GRUPO_DEPENDENCIA",
      "CODIGO_REGION",
    ],
    descarga: "/archivos/ArchivoC_Adm2025.csv",
    fuenteOriginal: "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("ArchivoC_Adm2025.csv", sep = ";")

datos_filtro <- subset(datos,
                       GRUPO_DEPENDENCIA %in% c(1, 3) &
                       SITUACION_EGRESO %in% c(1, 2, 3, 4))

datos_filtro$tipo_colegio <- ifelse(datos_filtro$GRUPO_DEPENDENCIA == 1,
                                    "Municipal",
                                    "Particular_Pagado")

datos_final <- datos_filtro[, c(
  "GRUPO_DEPENDENCIA",
  "CLEC_REG_ACTUAL",
  "MATE1_REG_ACTUAL",
  "PROMEDIO_NOTAS",
  "PTJE_NEM",
  "PTJE_RANKING",
  "CODIGO_REGION"
)]

datos_final <- subset(datos_final, CLEC_REG_ACTUAL > 0)
datos_final <- subset(datos_final, MATE1_REG_ACTUAL > 0)
datos_final$PROMEDIO_NOTAS <- gsub(",", ".", datos_final$PROMEDIO_NOTAS)
datos_final$PROMEDIO_NOTAS <- as.numeric(datos_final$PROMEDIO_NOTAS)

head(datos_final)
summary(datos_final)`,
  },
  {
    id: "simce-2m-2024",
    nombre: "SIMCE 2° medio 2024",
    area: "Educación",
    icono: "🎓",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Correlación"],
    fuenteNombre: "Agencia de Calidad de la Educación",
    descripcion:
      "Resultados promedio por establecimiento en Matemática y Lectura, con región, comuna y dependencia administrativa.",
    contexto:
      "Esta base es útil para comparar establecimientos y regiones, y para explorar la relación entre los puntajes de Lectura y Matemática a nivel de colegio.",
    tecnicas: [
      "Boxplots por tipo de establecimiento",
      "Boxplots por región",
      "Histogramas",
      "Dispersión Lectura vs Matemática",
      "Correlación",
    ],
    preguntas: [
      "¿Existen diferencias en los puntajes SIMCE según tipo de establecimiento?",
      "¿Existen diferencias por región?",
      "¿Qué tan fuerte es la relación entre Lectura y Matemática?",
    ],
    variables: [
      "cod_reg_rbd",
      "cod_com_rbd",
      "cod_depe2",
      "prom_mate2m_rbd",
      "prom_lect2m_rbd",
    ],
    descarga: "/archivos/simce2m2024_rbd_preliminar.csv",
    fuenteOriginal: "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("simce2m2024_rbd_preliminar.csv",
                  sep = ";",
                  encoding = "latin1")

datos_simce <- datos[, c(
  "cod_reg_rbd",
  "cod_com_rbd",
  "cod_depe2",
  "prom_lect2m_rbd",
  "prom_mate2m_rbd"
)]

datos_simce <- subset(datos_simce,
                      prom_mate2m_rbd > 0 &
                      prom_lect2m_rbd > 0)

datos_simce$tipo_colegio <- factor(datos_simce$cod_depe2,
                                   levels = c(1, 2, 3, 4),
                                   labels = c("Municipal",
                                              "Subvencionado",
                                              "Particular_Pagado",
                                              "Administracion_Delegada"))

head(datos_simce)
summary(datos_simce)`,
  },
  {
    id: "casen-2024",
    nombre: "CASEN 2024",
    area: "Datos sociales",
    icono: "📊",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "Regresión", "Correlación"],
    fuenteNombre: "Observatorio Social",
    descripcion:
      "Encuesta socioeconómica con ingreso, escolaridad, pobreza, asistencia y deserción.",
    contexto:
      "Permite estudiar relaciones entre ingreso, escolaridad y pobreza, y conectar contexto social con decisiones de análisis estadístico.",
    tecnicas: [
      "Histogramas",
      "Boxplots por pobreza y sexo",
      "Gráficos de dispersión",
      "Correlación",
      "Regresión lineal",
    ],
    preguntas: [
      "¿Existe relación entre escolaridad e ingreso?",
      "¿Las personas en pobreza tienen menor escolaridad?",
      "¿Existen diferencias regionales de ingreso?",
    ],
    variables: [
      "edad",
      "sexo",
      "region",
      "esc",
      "ytot",
      "pobreza",
      "asiste",
      "desercion",
    ],
    fuenteOriginal:
      "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    script: `load("casen_2024")

datos_casen <- casen_2024

datos_casen2 <- datos_casen[, c(
  "edad",
  "sexo",
  "region",
  "esc",
  "ytot",
  "pobreza",
  "asiste",
  "desercion"
)]

codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)

for (v in names(datos_casen2)) {
  datos_casen2[[v]][datos_casen2[[v]] %in% codigos_invalidos] <- NA
}

datos_casen2 <- subset(datos_casen2,
                       !is.na(esc) &
                       !is.na(ytot) &
                       !is.na(pobreza) &
                       !is.na(sexo) &
                       !is.na(region))

datos_casen2 <- subset(datos_casen2, edad >= 15)
datos_casen2 <- subset(datos_casen2, esc >= 0)
datos_casen2 <- subset(datos_casen2, ytot > 0)

datos_casen2$sexo <- factor(datos_casen2$sexo)
datos_casen2$region <- factor(datos_casen2$region)
datos_casen2$pobreza <- factor(datos_casen2$pobreza)
datos_casen2$asiste <- factor(datos_casen2$asiste)
datos_casen2$desercion <- factor(datos_casen2$desercion)

head(datos_casen2)
summary(datos_casen2)`,
  },
  {
    id: "aire-cerrillos",
    nombre: "Calidad del aire - Cerrillos",
    area: "Medio ambiente",
    icono: "🌱",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Análisis temporal básico"],
    fuenteNombre: "SINCA / Ministerio del Medio Ambiente",
    descripcion:
      "Registros diarios validados de monitoreo ambiental para trabajar por mes, año y estación.",
    contexto:
      "Permite estudiar tiempo sin meterse en series de tiempo formales, usando comparaciones entre meses, estaciones y años.",
    tecnicas: [
      "Histogramas",
      "Boxplots por mes",
      "Boxplots por año",
      "Boxplots por estación",
      "ANOVA por mes",
      "TukeyHSD",
    ],
    preguntas: [
      "¿Existen diferencias entre meses?",
      "¿Existen diferencias por estación?",
      "¿Cómo evolucionan los registros validados en el tiempo?",
    ],
    variables: [
      "fecha",
      "hora",
      "reg_validos",
      "fecha_mes",
      "anio",
      "mes",
      "estacion",
    ],
    descarga: "/archivos/datos_final_aire_limpios.csv",
    fuenteOriginal: "https://sinca.mma.gob.cl/index.php/",
    script: `datos <- read.csv("datos_final_aire_limpios.csv",
                  sep = ",",
                  header = TRUE,
                  stringsAsFactors = FALSE)

datos <- datos[, colSums(is.na(datos)) < nrow(datos)]
if ("X" %in% names(datos)) datos$X <- NULL

if (ncol(datos) == 5) {
  names(datos) <- c("fecha", "hora", "reg_validos", "reg_preliminares", "reg_no_validos")
}
if (ncol(datos) == 4) {
  names(datos) <- c("fecha", "hora", "reg_validos", "reg_preliminares")
}

datos$fecha <- trimws(as.character(datos$fecha))
datos$fecha <- gsub("[^0-9]", "", datos$fecha)
datos$hora <- trimws(as.character(datos$hora))

limpiar_numerica <- function(x) {
  x <- trimws(as.character(x))
  x[x == ""] <- NA
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

if ("reg_validos" %in% names(datos)) {
  datos$reg_validos <- limpiar_numerica(datos$reg_validos)
}

datos$fecha_mes <- as.Date(datos$fecha, format = "%y%m%d")

datos_validos <- subset(datos,
                        !is.na(fecha_mes) &
                        !is.na(reg_validos))

datos_validos$anio <- format(datos_validos$fecha_mes, "%Y")
datos_validos$mes_num <- format(datos_validos$fecha_mes, "%m")
datos_validos$dia <- format(datos_validos$fecha_mes, "%d")

datos_validos$mes <- factor(
  datos_validos$mes_num,
  levels = c("01","02","03","04","05","06","07","08","09","10","11","12"),
  labels = c("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic")
)

datos_validos$estacion <- ifelse(datos_validos$mes_num %in% c("12","01","02"), "Verano",
                          ifelse(datos_validos$mes_num %in% c("03","04","05"), "Otoño",
                          ifelse(datos_validos$mes_num %in% c("06","07","08"), "Invierno", "Primavera")))

datos_validos$estacion <- factor(
  datos_validos$estacion,
  levels = c("Verano", "Otoño", "Invierno", "Primavera")
)

head(datos_validos)
summary(datos_validos)`,
  },
];

const areas = [
  {
    nombre: "Educación",
    icono: "🎓",
    descripcion:
      "Bases para rendimiento académico, contexto escolar y comparaciones entre establecimientos.",
    color: "#1d4ed8",
  },
  {
    nombre: "Datos sociales",
    icono: "📊",
    descripcion:
      "Bases para estudiar ingreso, pobreza, escolaridad y desigualdad.",
    color: "#047857",
  },
  {
    nombre: "Medio ambiente",
    icono: "🌱",
    descripcion:
      "Bases para calidad del aire, registros ambientales y análisis temporal básico.",
    color: "#b45309",
  },
];

const fuentes = [
  {
    nombre: "Agencia de Calidad de la Educación",
    descripcion: "Bases relacionadas con resultados educativos y establecimientos.",
    url: "https://informacionestadistica.agenciaeducacion.cl/#/bases",
  },
  {
    nombre: "Observatorio Social",
    descripcion: "Información oficial de CASEN y encuestas sociales.",
    url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
  },
  {
    nombre: "SINCA",
    descripcion: "Sistema de Información Nacional de Calidad del Aire.",
    url: "https://sinca.mma.gob.cl/index.php/",
  },
];

const ejercicios = [
  {
    tema: "Análisis exploratorio",
    icono: "📈",
    ejercicio:
      "Usa la base SIMCE para describir la distribución de los puntajes de Matemática y Lectura. Construye histogramas, boxplots y compara resultados por tipo de establecimiento.",
    pasos: [
      "Cargar y limpiar la base.",
      "Seleccionar variables de interés.",
      "Crear gráficos descriptivos.",
      "Escribir una interpretación breve.",
    ],
  },
  {
    tema: "ANOVA",
    icono: "📊",
    ejercicio:
      "Usa la base de calidad del aire para comparar si los registros validados presentan diferencias entre meses.",
    pasos: [
      "Definir la variable respuesta.",
      "Definir el factor de comparación.",
      "Ajustar un modelo ANOVA.",
      "Interpretar si existen diferencias entre grupos.",
    ],
  },
  {
    tema: "Regresión lineal",
    icono: "📉",
    ejercicio:
      "Usa CASEN para estudiar la relación entre años de escolaridad e ingreso total.",
    pasos: [
      "Seleccionar escolaridad e ingreso.",
      "Limpiar códigos inválidos.",
      "Explorar la relación con gráficos.",
      "Proponer un modelo de regresión lineal simple.",
    ],
  },
  {
    tema: "Regresión logística",
    icono: "🔀",
    ejercicio:
      "Usa una variable categórica, como asistencia o deserción, para plantear un modelo donde la respuesta sea binaria.",
    pasos: [
      "Definir una variable respuesta binaria.",
      "Seleccionar variables explicativas.",
      "Limpiar registros inválidos.",
      "Interpretar la probabilidad estimada.",
    ],
  },
  {
    tema: "Correlación",
    icono: "🔗",
    ejercicio:
      "Usa SIMCE para estudiar la relación entre puntajes de Lectura y Matemática.",
    pasos: [
      "Filtrar puntajes válidos.",
      "Crear gráfico de dispersión.",
      "Calcular correlación.",
      "Interpretar dirección y fuerza de la relación.",
    ],
  },
];

const filtrosDisponibles = {
  tamano: ["Pequeña", "Mediana", "Grande"],
  analisis: [
    "Exploratorio",
    "t-test",
    "ANOVA",
    "Regresión",
    "Correlación",
    "Análisis temporal básico",
  ],
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#111827",
    width: "100%",
  },
  header: {
    background: "#0b1220",
    color: "white",
    padding: "18px 56px",
    borderBottom: "4px solid #1d4ed8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  headerTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  headerSubtitle: {
    margin: "5px 0 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  nav: {
    display: "flex",
    gap: "18px",
    fontSize: "14px",
    color: "#e5e7eb",
  },
  navItem: {
    color: "#e5e7eb",
    textDecoration: "none",
    cursor: "pointer",
  },
  mainWrap: {
    width: "100%",
    padding: "34px 56px",
  },
  heroFormal: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #dbe3ef",
    padding: "38px 44px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    marginBottom: "30px",
  },
  eyebrow: {
    margin: 0,
    color: "#1d4ed8",
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontSize: "14px",
    textTransform: "uppercase",
  },
  brandTitle: {
    fontSize: "38px",
    margin: "8px 0 0 0",
    color: "#111827",
    lineHeight: 1.15,
  },
  brandText: {
    color: "#334155",
    fontSize: "17px",
    lineHeight: 1.7,
    maxWidth: "1000px",
    marginTop: "12px",
  },
  searchBox: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    marginTop: "24px",
    background: "white",
    color: "#111827",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginTop: "22px",
  },
  statCard: {
    background: "#f8fafc",
    border: "1px solid #dbe3ef",
    borderRadius: "8px",
    padding: "16px",
  },
  statNumber: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0b1220",
    margin: 0,
  },
  statLabel: {
    color: "#475569",
    margin: "4px 0 0 0",
    fontSize: "14px",
  },
  title: {
    fontSize: "30px",
    margin: "10px 0 8px 0",
    color: "#111827",
    fontWeight: 700,
  },
  sectionSubtitle: {
    color: "#475569",
    marginTop: "0",
    marginBottom: "20px",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
    marginTop: "18px",
  },
  card: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #dbe3ef",
    padding: "24px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
  },
  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    background: "#eef4ff",
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },
  smallMuted: {
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef4ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: "13px",
    marginRight: "8px",
    marginBottom: "8px",
  },
  button: {
    background: "#0b1220",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "11px 15px",
    cursor: "pointer",
    fontWeight: 700,
  },
  buttonAlt: {
    background: "white",
    color: "#0b1220",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "11px 15px",
    cursor: "pointer",
    fontWeight: 700,
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    color: "#334155",
    fontSize: "14px",
    margin: "14px 0",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "22px",
    alignItems: "start",
  },
  sidebar: {
    background: "white",
    borderRadius: "8px",
    border: "1px solid #dbe3ef",
    padding: "22px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
    position: "sticky",
    top: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginTop: "8px",
    background: "white",
    color: "#111827",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: "22px",
    alignItems: "start",
  },
  pre: {
    background: "#0b1220",
    color: "#e5e7eb",
    borderRadius: "8px",
    padding: "22px",
    fontSize: "14px",
    lineHeight: 1.6,
    overflowX: "auto",
    whiteSpace: "pre",
    textAlign: "left",
    fontFamily: "Consolas, 'Courier New', monospace",
  },
  linkBox: {
    background: "#f8fafc",
    border: "1px solid #dbe3ef",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "18px",
    color: "#334155",
  },
};

function Home({ onOpenArea, onOpenDataset }) {
  const [busquedaHome, setBusquedaHome] = useState("");

  const resultadosBusqueda = useMemo(() => {
    if (!busquedaHome.trim()) return datasets;

    return datasets.filter((d) => {
      const texto = [
        d.nombre,
        d.area,
        d.descripcion,
        d.contexto,
        d.fuenteNombre,
        d.formato,
        ...d.variables,
        ...d.tecnicas,
        ...d.preguntas,
      ]
        .join(" ")
        .toLowerCase();

      return texto.includes(busquedaHome.toLowerCase());
    });
  }, [busquedaHome]);

  return (
    <div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>Repertorio de bases de datos chilenas</p>
        <h1 style={s.brandTitle}>
          Catálogo académico para análisis estadístico con datos reales
        </h1>
        <p style={s.brandText}>
          Plataforma que reúne bases de datos chilenas organizadas por área,
          fuente oficial, formato, variables disponibles y técnicas estadísticas
          sugeridas. Cada ficha incluye contexto, preguntas de investigación y
          un script base en R para iniciar la limpieza de los datos.
        </p>

        <input
          style={s.searchBox}
          placeholder="Buscar por nombre, área, fuente, variable o técnica..."
          value={busquedaHome}
          onChange={(e) => setBusquedaHome(e.target.value)}
        />

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <p style={s.statNumber}>{datasets.length}</p>
            <p style={s.statLabel}>datasets incorporados</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNumber}>{areas.length}</p>
            <p style={s.statLabel}>áreas temáticas</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNumber}>{fuentes.length}</p>
            <p style={s.statLabel}>fuentes oficiales</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNumber}>{ejercicios.length}</p>
            <p style={s.statLabel}>ejercicios sugeridos</p>
          </div>
        </div>
      </div>

      <h2 style={s.title}>Sobre el repertorio</h2>
      <p style={s.sectionSubtitle}>
        Este espacio está pensado como apoyo inicial para estudiantes que necesitan trabajar con datos reales.
      </p>

      <div style={s.card}>
        <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>
          El objetivo del repertorio es reunir bases de datos chilenas que puedan ser utilizadas
          en cursos introductorios e intermedios de estadística. Cada ficha entrega contexto,
          variables relevantes, preguntas posibles y un código inicial de limpieza. La idea no
          es entregar el análisis completo, sino facilitar el punto de partida para que cada
          estudiante formule su propia pregunta, realice el análisis correspondiente e interprete
          sus resultados.
        </p>
      </div>

      <h2 style={{ ...s.title, marginTop: "40px" }}>
        {busquedaHome.trim() ? "Resultados de búsqueda" : "Datasets destacados"}
      </h2>
      <p style={s.sectionSubtitle}>
        {busquedaHome.trim()
          ? `Se encontraron ${resultadosBusqueda.length} resultado(s).`
          : "Bases incorporadas actualmente al repertorio."}
      </p>

      <div style={s.grid}>
        {resultadosBusqueda.map((d) => (
          <div key={d.id} style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 700 }}>
                  {d.area}
                </p>
                <h3 style={{ margin: "6px 0 8px 0", fontSize: "22px" }}>
                  {d.nombre}
                </h3>
              </div>
              <div style={s.iconBox}>{d.icono}</div>
            </div>

            <p style={s.smallMuted}>{d.descripcion}</p>

            <div style={{ margin: "12px 0" }}>
              {d.analisis.slice(0, 3).map((item) => (
                <span key={item} style={s.badge}>
                  {item}
                </span>
              ))}
            </div>

            <div style={s.meta}>
              <div>
                <strong>Formato:</strong> {d.formato}
              </div>
              <div>
                <strong>Tamaño:</strong> {d.tamano}
              </div>
              <div>
                <strong>Variables:</strong> {d.variables.length}
              </div>
              <div>
                <strong>Fuente:</strong> {d.fuenteNombre}
              </div>
            </div>

            <button style={s.button} onClick={() => onOpenDataset(d, "inicio")}>
              Ver ficha
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ ...s.title, marginTop: "40px" }}>Ejemplo completo guiado</h2>
      <p style={s.sectionSubtitle}>
        Ejemplo de estructura para trabajar una base pequeña, sin reemplazar el trabajo del estudiante.
      </p>

      <div style={s.card}>
        <h3 style={{ marginTop: 0 }}>Ejemplo: comparación de puntajes SIMCE por tipo de establecimiento</h3>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          Este ejemplo muestra cómo podría organizarse un análisis usando una versión reducida
          de una base, por ejemplo una muestra de 100 establecimientos. El objetivo es mostrar
          el orden del trabajo, no entregar una solución cerrada.
        </p>
        <ol style={{ color: "#475569", lineHeight: 1.8 }}>
          <li>Identificar la unidad de análisis: establecimiento educacional.</li>
          <li>Seleccionar variables: puntaje de Matemática, Lectura y tipo de colegio.</li>
          <li>Filtrar registros inválidos, como puntajes iguales a cero.</li>
          <li>Describir los datos con tablas, histogramas y boxplots.</li>
          <li>Plantear una pregunta: ¿hay diferencias de puntaje según tipo de colegio?</li>
          <li>Elegir una técnica, por ejemplo ANOVA o comparación de grupos.</li>
          <li>Interpretar los resultados en lenguaje claro, considerando el contexto.</li>
        </ol>
      </div>

      <h2 style={{ ...s.title, marginTop: "40px" }}>Ejercicios sugeridos</h2>
      <p style={s.sectionSubtitle}>
        Ejercicios organizados por tema. Esta sección puede ampliarse agregando nuevas tarjetas.
      </p>

      <div style={s.grid}>
        {ejercicios.map((e) => (
          <div key={e.tema} style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={s.iconBox}>{e.icono}</div>
              <h3 style={{ margin: 0 }}>{e.tema}</h3>
            </div>
            <p style={{ ...s.smallMuted, marginTop: "14px" }}>{e.ejercicio}</p>
            <ol style={{ color: "#475569", lineHeight: 1.7, paddingLeft: "20px" }}>
              {e.pasos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <h2 style={{ ...s.title, marginTop: "40px" }}>Explorar por área</h2>
      <p style={s.sectionSubtitle}>
        Entra a una categoría específica para filtrar bases según tamaño o técnica principal.
      </p>

      <div style={s.grid}>
        {areas.map((area) => (
          <div key={area.nombre} style={s.card}>
            <div
              style={{
                height: "6px",
                borderRadius: "999px",
                background: area.color,
                marginBottom: "18px",
              }}
            />
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={s.iconBox}>{area.icono}</div>
              <h3 style={{ fontSize: "24px", margin: 0 }}>{area.nombre}</h3>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.6 }}>{area.descripcion}</p>
            <button style={s.button} onClick={() => onOpenArea(area.nombre)}>
              Entrar al área
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ ...s.title, marginTop: "40px" }}>Fuentes oficiales</h2>
      <p style={s.sectionSubtitle}>
        Sitios desde donde provienen las bases incorporadas en el repertorio.
      </p>

      <div style={s.grid}>
        {fuentes.map((fuente) => (
          <div key={fuente.nombre} style={s.card}>
            <h3 style={{ marginTop: 0 }}>{fuente.nombre}</h3>
            <p style={s.smallMuted}>{fuente.descripcion}</p>
            <a href={fuente.url} target="_blank" rel="noreferrer">
              Abrir fuente oficial
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function AreaPage({ area, onBack, onOpenDataset }) {
  const [busqueda, setBusqueda] = useState("");
  const [tamano, setTamano] = useState("");
  const [analisis, setAnalisis] = useState("");

  const filtrados = useMemo(() => {
    return datasets
      .filter((d) => d.area === area)
      .filter((d) => {
        if (!busqueda.trim()) return true;
        const texto = [
          d.nombre,
          d.descripcion,
          d.contexto,
          d.fuenteNombre,
          d.formato,
          ...d.variables,
          ...d.tecnicas,
          ...d.preguntas,
        ]
          .join(" ")
          .toLowerCase();
        return texto.includes(busqueda.toLowerCase());
      })
      .filter((d) => (tamano ? d.tamano === tamano : true))
      .filter((d) => (analisis ? d.analisis.includes(analisis) : true));
  }, [area, busqueda, tamano, analisis]);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>
          ← Volver a la portada
        </button>
      </div>

      <div style={s.layout}>
        <div style={s.sidebar}>
          <h2 style={{ marginTop: 0 }}>{area}</h2>

          <div style={{ marginBottom: "16px" }}>
            <strong>Buscar</strong>
            <input
              style={s.input}
              placeholder="Base, variable o técnica..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Tamaño</strong>
            <select
              style={s.input}
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
            >
              <option value="">Todos</option>
              {filtrosDisponibles.tamano.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div>
            <strong>Técnica principal</strong>
            <select
              style={s.input}
              value={analisis}
              onChange={(e) => setAnalisis(e.target.value)}
            >
              <option value="">Todas</option>
              {filtrosDisponibles.analisis.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Bases disponibles</h2>
            <p style={{ color: "#475569" }}>{filtrados.length} resultado(s)</p>
          </div>

          {filtrados.map((d) => (
            <div key={d.id} style={{ ...s.card, marginTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "24px", margin: 0 }}>{d.nombre}</h3>
                  <p style={{ color: "#475569", lineHeight: 1.6 }}>{d.descripcion}</p>
                </div>
                <div style={s.iconBox}>{d.icono}</div>
              </div>

              <div>
                {d.analisis.map((item) => (
                  <span key={item} style={s.badge}>{item}</span>
                ))}
              </div>

              <div style={s.meta}>
                <div><strong>Formato:</strong> {d.formato}</div>
                <div><strong>Tamaño:</strong> {d.tamano}</div>
                <div><strong>Variables:</strong> {d.variables.length}</div>
                <div><strong>Fuente:</strong> {d.fuenteNombre}</div>
              </div>

              <button style={s.button} onClick={() => onOpenDataset(d, "area")}>
                Ver ficha completa
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatasetPage({ dataset, onBack }) {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver</button>
      </div>

      <div style={s.heroFormal}>
        <p style={s.eyebrow}>{dataset.area}</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>{dataset.nombre}</h1>
        <p style={s.brandText}>{dataset.contexto}</p>
      </div>

      <div style={s.twoCol}>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Contexto</h2>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>{dataset.contexto}</p>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Código base en R</h2>
            <p style={{ color: "#475569", marginTop: 0 }}>
              Script sugerido para filtrar y preparar la base. Está pensado para copiar y pegar.
            </p>
            <pre style={s.pre}>{dataset.script}</pre>
          </div>
        </div>

        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Información del dataset</h2>
            <p><strong>Área:</strong> {dataset.area}</p>
            <p><strong>Fuente:</strong> {dataset.fuenteNombre}</p>
            <p><strong>Formato:</strong> {dataset.formato}</p>
            <p><strong>Tamaño:</strong> {dataset.tamano}</p>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Técnicas recomendadas</h2>
            {dataset.tecnicas.map((t) => (
              <span key={t} style={s.badge}>{t}</span>
            ))}
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Variables clave</h2>
            {dataset.variables.map((v) => (
              <span key={v} style={s.badge}>{v}</span>
            ))}
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Preguntas de investigación</h2>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
              {dataset.preguntas.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div style={s.linkBox}>
            {dataset.descarga && (
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Archivo de datos:</strong>{" "}
                <a href={dataset.descarga} download>Descargar archivo</a>
              </p>
            )}

            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Fuente original:</strong>{" "}
              <a href={dataset.fuenteOriginal} target="_blank" rel="noreferrer">
                Abrir sitio oficial
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [vista, setVista] = useState("inicio");
  const [areaActual, setAreaActual] = useState(null);
  const [datasetActual, setDatasetActual] = useState(null);
  const [origenDataset, setOrigenDataset] = useState("inicio");

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Repertorio de Bases de Datos Chilenas</h1>
          <p style={s.headerSubtitle}>
            Plataforma académica para consulta, descarga y preparación de datos reales.
          </p>
        </div>
        <nav style={s.nav}>
          <span style={s.navItem} onClick={() => setVista("inicio")}>Inicio</span>
          <span style={s.navItem} onClick={() => setVista("inicio")}>Datasets</span>
          <span style={s.navItem} onClick={() => setVista("inicio")}>Ejercicios</span>
          <span style={s.navItem} onClick={() => setVista("inicio")}>Fuentes</span>
        </nav>
      </header>

      <main style={s.mainWrap}>
        {vista === "inicio" && (
          <Home
            onOpenArea={(area) => {
              setAreaActual(area);
              setVista("area");
            }}
            onOpenDataset={(dataset, origen) => {
              setDatasetActual(dataset);
              setOrigenDataset(origen);
              setVista("dataset");
            }}
          />
        )}

        {vista === "area" && (
          <AreaPage
            area={areaActual}
            onBack={() => setVista("inicio")}
            onOpenDataset={(dataset, origen) => {
              setDatasetActual(dataset);
              setOrigenDataset(origen);
              setVista("dataset");
            }}
          />
        )}

        {vista === "dataset" && (
          <DatasetPage
            dataset={datasetActual}
            onBack={() => {
              if (origenDataset === "area") setVista("area");
              else setVista("inicio");
            }}
          />
        )}
      </main>
    </div>
  );
}