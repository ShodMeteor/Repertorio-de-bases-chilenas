import { useMemo, useState } from "react";

const datasets = [
  {
    id: "paes-2025",
    nombre: "PAES 2025",
    area: "Educación",
    nivel: "Intermedio",
    limpieza: "Media",
    tamano: "Grande",
    analisis: ["Exploratorio", "t-test", "ANOVA", "Correlación"],
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
    fuenteOriginal:
      "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("ArchivoC_Adm2025.csv", sep = ";")

# Filtrar colegios de interés y situación de egreso
datos_filtro <- subset(datos,
                       GRUPO_DEPENDENCIA %in% c(1, 3) &
                       SITUACION_EGRESO %in% c(1, 2, 3, 4))

# Crear tipo de colegio
datos_filtro$tipo_colegio <- ifelse(datos_filtro$GRUPO_DEPENDENCIA == 1,
                                    "Municipal",
                                    "Particular_Pagado")

# Seleccionar variables principales
datos_final <- datos_filtro[, c(
  "GRUPO_DEPENDENCIA",
  "CLEC_REG_ACTUAL",
  "MATE1_REG_ACTUAL",
  "PROMEDIO_NOTAS",
  "PTJE_NEM",
  "PTJE_RANKING",
  "CODIGO_REGION"
)]

# Limpiar variables
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
    nivel: "Básico",
    limpieza: "Baja",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Correlación"],
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
    fuenteOriginal:
      "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("simce2m2024_rbd_preliminar.csv",
                  sep = ";",
                  encoding = "latin1")

# Seleccionar variables principales
datos_simce <- datos[, c(
  "cod_reg_rbd",
  "cod_com_rbd",
  "cod_depe2",
  "prom_lect2m_rbd",
  "prom_mate2m_rbd"
)]

# Filtrar puntajes válidos
datos_simce <- subset(datos_simce,
                      prom_mate2m_rbd > 0 &
                      prom_lect2m_rbd > 0)

# Crear tipo de colegio
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
    nivel: "Intermedio",
    limpieza: "Alta",
    tamano: "Grande",
    analisis: ["Exploratorio", "Regresión", "Correlación"],
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

# Seleccionar variables útiles
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

# Reemplazar códigos inválidos por NA
codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)

for (v in names(datos_casen2)) {
  datos_casen2[[v]][datos_casen2[[v]] %in% codigos_invalidos] <- NA
}

# Filtrar observaciones válidas
datos_casen2 <- subset(datos_casen2,
                       !is.na(esc) &
                       !is.na(ytot) &
                       !is.na(pobreza) &
                       !is.na(sexo) &
                       !is.na(region))

datos_casen2 <- subset(datos_casen2, edad >= 15)
datos_casen2 <- subset(datos_casen2, esc >= 0)
datos_casen2 <- subset(datos_casen2, ytot > 0)

# Convertir variables categóricas
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
    nivel: "Intermedio",
    limpieza: "Media",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Análisis temporal básico"],
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

# Si se trabaja desde la base original en bruto:
# datos <- read.csv("datos_220401_260410.csv",
#                   sep = ";",
#                   header = TRUE,
#                   stringsAsFactors = FALSE)

# Eliminar columnas vacías
datos <- datos[, colSums(is.na(datos)) < nrow(datos)]
if ("X" %in% names(datos)) datos$X <- NULL

# Renombrar variables si corresponde
if (ncol(datos) == 5) {
  names(datos) <- c("fecha", "hora", "reg_validos", "reg_preliminares", "reg_no_validos")
}
if (ncol(datos) == 4) {
  names(datos) <- c("fecha", "hora", "reg_validos", "reg_preliminares")
}

# Limpiar variables
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
if ("reg_preliminares" %in% names(datos)) {
  datos$reg_preliminares <- limpiar_numerica(datos$reg_preliminares)
}
if ("reg_no_validos" %in% names(datos)) {
  datos$reg_no_validos <- limpiar_numerica(datos$reg_no_validos)
}

# Crear fecha correctamente
datos$fecha_mes <- as.Date(datos$fecha, format = "%y%m%d")

# Filtrar filas válidas
datos_validos <- subset(datos,
                        !is.na(fecha_mes) &
                        !is.na(reg_validos))

# Crear variables temporales
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
    descripcion:
      "Bases para rendimiento académico, contexto escolar y comparaciones entre establecimientos.",
    color: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
  },
  {
    nombre: "Datos sociales",
    descripcion:
      "Bases para estudiar ingreso, pobreza, escolaridad y desigualdad.",
    color: "linear-gradient(135deg, #047857, #10b981)",
  },
  {
    nombre: "Medio ambiente",
    descripcion:
      "Bases para calidad del aire, registros ambientales y análisis temporal básico.",
    color: "linear-gradient(135deg, #b45309, #f59e0b)",
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
    background:
      "linear-gradient(180deg, #0b1220 0%, #111827 26%, #f8fafc 26%, #f8fafc 100%)",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "24px",
  },
  heroFormal: {
    background: "white",
    borderRadius: "28px",
    border: "1px solid #e2e8f0",
    padding: "40px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    marginBottom: "28px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  brandTitle: {
    fontSize: "40px",
    margin: 0,
    color: "#0f172a",
    lineHeight: 1.1,
    opacity: 1,
  },
  brandText: {
    color: "#475569",
    fontSize: "17px",
    lineHeight: 1.7,
    maxWidth: "820px",
    marginTop: "12px",
    opacity: 1,
  },
  searchBox: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    marginTop: "18px",
  },
  featuredGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginTop: "18px",
  },
  featuredCard: {
    background: "white",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    padding: "18px",
    boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
  },
  smallMuted: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.6,
    opacity: 1,
  },
  sectionSubtitle: {
    color: "#64748b",
    marginTop: "-8px",
    marginBottom: "18px",
    opacity: 1,
  },
  title: {
    fontSize: "30px",
    margin: "6px 0 18px 0",
    color: "#0f172a",
    opacity: 1,
  },
  areasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  areaCard: {
    background: "white",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    padding: "22px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
  },
  button: {
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  buttonAlt: {
    background: "white",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "290px 1fr",
    gap: "20px",
    alignItems: "start",
  },
  sidebar: {
    background: "white",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
    position: "sticky",
    top: "20px",
  },
  card: {
    background: "white",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    padding: "22px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
  },
  datasetCard: {
    background: "white",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    padding: "22px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginTop: "8px",
    background: "white",
    color: "#0f172a",
    opacity: 1,
  },
  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: "13px",
    marginRight: "8px",
    marginBottom: "8px",
    opacity: 1,
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    color: "#475569",
    fontSize: "14px",
    margin: "14px 0",
    opacity: 1,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.9fr",
    gap: "20px",
    alignItems: "start",
  },
  pre: {
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: "16px",
    padding: "18px",
    fontSize: "13px",
    lineHeight: 1.6,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
  },
  linkBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "18px",
    color: "#334155",
    opacity: 1,
  },
  pills: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "22px",
  },
  pill: {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    fontSize: "14px",
    color: "#1d4ed8",
    opacity: 1,
  },
};

function Home({ onOpenArea, onOpenDataset }) {
  const [busquedaHome, setBusquedaHome] = useState("");

  const resultadosBusqueda = useMemo(() => {
    if (!busquedaHome.trim()) return datasets.slice(0, 4);

    return datasets.filter((d) => {
      const texto = [
        d.nombre,
        d.area,
        d.descripcion,
        d.contexto,
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
        <div style={s.topBar}>
          <div>
            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontWeight: 700,
                letterSpacing: "0.04em",
                opacity: 1,
              }}
            >
              REPERTORIO DE BASES DE DATOS CHILENAS
            </p>
            <h1 style={s.brandTitle}>
              Explora datasets reales para análisis estadístico
            </h1>
            <p style={s.brandText}>
              Catálogo de bases de datos chilenas organizado por área, con contexto,
              filtros, técnicas recomendadas, preguntas de investigación y scripts
              base en R para comenzar a trabajar con datos reales.
            </p>
          </div>
        </div>

        <input
          style={s.searchBox}
          placeholder="Busca datasets, áreas, variables o técnicas..."
          value={busquedaHome}
          onChange={(e) => setBusquedaHome(e.target.value)}
        />

        <div style={s.pills}>
          <span style={s.pill}>Catálogo por áreas</span>
          <span style={s.pill}>Filtros por tamaño</span>
          <span style={s.pill}>Scripts en R</span>
          <span style={s.pill}>Links de descarga</span>
        </div>
      </div>

      <h2 style={s.title}>
        {busquedaHome.trim() ? "Resultados de búsqueda" : "Datasets destacados"}
      </h2>
      <p style={s.sectionSubtitle}>
        {busquedaHome.trim()
          ? `Se encontraron ${resultadosBusqueda.length} resultado(s).`
          : "Una selección inicial de bases disponibles."}
      </p>

      <div style={s.featuredGrid}>
        {resultadosBusqueda.map((d) => (
          <div key={d.id} style={s.featuredCard}>
            <p style={{ margin: "0 0 8px 0", color: "#2563eb", fontWeight: 700, opacity: 1 }}>
              {d.area}
            </p>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", color: "#0f172a", opacity: 1 }}>
              {d.nombre}
            </h3>
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
                <strong>Tamaño:</strong> {d.tamano}
              </div>
              <div>
                <strong>Variables:</strong> {d.variables.length}
              </div>
            </div>

            <button style={s.button} onClick={() => onOpenDataset(d, "inicio")}>
              Ver dataset
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ ...s.title, marginTop: "34px" }}>Explorar por área</h2>
      <p style={s.sectionSubtitle}>
        Entra a una categoría específica para filtrar las bases según tamaño o técnica principal.
      </p>

      <div style={s.areasGrid}>
        {areas.map((area) => (
          <div key={area.nombre} style={s.areaCard}>
            <div
              style={{
                height: "12px",
                borderRadius: "999px",
                background: area.color,
                marginBottom: "18px",
              }}
            />
            <h3 style={{ fontSize: "24px", margin: "0 0 10px 0", color: "#0f172a", opacity: 1 }}>
              {area.nombre}
            </h3>
            <p style={{ color: "#475569", lineHeight: 1.6, opacity: 1 }}>{area.descripcion}</p>
            <div style={{ marginTop: "16px" }}>
              <button style={s.button} onClick={() => onOpenArea(area.nombre)}>
                Entrar al área
              </button>
            </div>
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
          <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>{area}</h2>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6, opacity: 1 }}>
            Filtra las bases según el tipo de análisis que buscas.
          </p>

          <div style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#0f172a" }}>Buscar</strong>
            <input
              style={s.input}
              placeholder="Base, variable o técnica..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong style={{ color: "#0f172a" }}>Tamaño</strong>
            <select style={s.input} value={tamano} onChange={(e) => setTamano(e.target.value)}>
              <option value="">Todos</option>
              {filtrosDisponibles.tamano.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <div>
            <strong style={{ color: "#0f172a" }}>Técnica principal</strong>
            <select style={s.input} value={analisis} onChange={(e) => setAnalisis(e.target.value)}>
              <option value="">Todas</option>
              {filtrosDisponibles.analisis.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Bases disponibles</h2>
            <p style={{ color: "#64748b", opacity: 1 }}>{filtrados.length} resultado(s)</p>
          </div>

          {filtrados.map((d) => (
            <div key={d.id} style={s.datasetCard}>
              <h3 style={{ fontSize: "24px", marginTop: 0, color: "#0f172a", opacity: 1 }}>
                {d.nombre}
              </h3>
              <p style={{ color: "#475569", lineHeight: 1.6, opacity: 1 }}>{d.descripcion}</p>

              <div>
                {d.analisis.map((item) => (
                  <span key={item} style={s.badge}>
                    {item}
                  </span>
                ))}
              </div>

              <div style={s.meta}>
                <div>
                  <strong>Tamaño:</strong> {d.tamano}
                </div>
                <div>
                  <strong>Variables:</strong> {d.variables.length}
                </div>
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
        <button style={s.buttonAlt} onClick={onBack}>
          ← Volver
        </button>
      </div>

      <div style={s.heroFormal}>
        <div>
          <div style={{ marginBottom: "12px" }}>
            <span style={s.pill}>{dataset.area}</span>
            <span style={{ ...s.pill, marginLeft: 8 }}>{dataset.nivel}</span>
          </div>
          <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>{dataset.nombre}</h1>
          <p style={s.brandText}>{dataset.contexto}</p>
        </div>
      </div>

      <div style={s.twoCol}>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Contexto</h2>
            <p style={{ color: "#475569", lineHeight: 1.7, opacity: 1 }}>{dataset.contexto}</p>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Código base en R</h2>
            <p style={{ color: "#64748b", marginTop: 0, opacity: 1 }}>
              Script sugerido para filtrar y preparar la base. Está pensado para copiar y pegar.
            </p>
            <pre style={s.pre}>{dataset.script}</pre>
          </div>
        </div>

        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Técnicas recomendadas</h2>
            <div>
              {dataset.tecnicas.map((t) => (
                <span key={t} style={s.badge}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Variables clave</h2>
            <div>
              {dataset.variables.map((v) => (
                <span key={v} style={s.badge}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0, color: "#0f172a", opacity: 1 }}>Preguntas de investigación</h2>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px", opacity: 1 }}>
              {dataset.preguntas.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div style={s.linkBox}>
            {dataset.descarga !== "#" && (
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Archivo de datos:</strong>{" "}
                <a href={dataset.descarga} download>
                  Descargar archivo
                </a>
              </p>
            )}

            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Fuente original del sitio:</strong>{" "}
              <a href={dataset.fuenteOriginal} target="_blank" rel="noreferrer">
                Abrir sitio oficial
              </a>
            </p>

            <p style={{ margin: 0 }}>
              <strong>Área:</strong> {dataset.area}
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
      <div style={s.container}>
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
              if (origenDataset === "area") {
                setVista("area");
              } else {
                setVista("inicio");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}