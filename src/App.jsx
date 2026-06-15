import { useEffect, useMemo, useState } from "react";

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
    unidad: "Postulante / estudiante",
    descripcion:
      "Resultados de estudiantes en Matemática, Competencia Lectora, NEM, Ranking y variables del establecimiento.",
    contexto:
      "La base PAES permite trabajar con información asociada al proceso de admisión universitaria en Chile. Incluye puntajes de pruebas, antecedentes escolares y variables relacionadas con el establecimiento de origen. Es útil para estudiar diferencias de rendimiento entre tipos de colegio, regiones y grupos de estudiantes, además de explorar relaciones entre notas de enseñanza media, ranking y puntajes en pruebas estandarizadas.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de grupos, pruebas de hipótesis, análisis regional, correlación entre puntajes y modelos de regresión simples.",
    tecnicas: ["Histogramas", "Boxplots por tipo de colegio", "Gráficos de dispersión", "t-test", "ANOVA regional", "Correlación"],
    preguntas: [
      "¿Existen diferencias entre colegios municipales y particulares pagados?",
      "¿Existen diferencias regionales en los puntajes?",
      "¿Qué relación hay entre NEM, ranking y puntajes PAES?",
    ],
    variables: ["MATE1_REG_ACTUAL", "CLEC_REG_ACTUAL", "PTJE_NEM", "PTJE_RANKING", "PROMEDIO_NOTAS", "GRUPO_DEPENDENCIA", "CODIGO_REGION"],
    descarga: "/archivos/ArchivoC_Adm2025.csv",
    fuenteOriginal: "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("ArchivoC_Adm2025.csv",
                  sep = ";",
                  stringsAsFactors = FALSE)

# 1. Filtrar grupos de dependencia de interés
# 1 = Municipal, 3 = Particular pagado
datos_filtro <- subset(datos,
                       GRUPO_DEPENDENCIA %in% c(1, 3) &
                       SITUACION_EGRESO %in% c(1, 2, 3, 4))

# 2. Crear variable categórica más interpretable
datos_filtro$tipo_colegio <- ifelse(datos_filtro$GRUPO_DEPENDENCIA == 1,
                                    "Municipal",
                                    "Particular_Pagado")

# 3. Seleccionar variables principales
datos_final <- datos_filtro[, c(
  "tipo_colegio",
  "GRUPO_DEPENDENCIA",
  "CLEC_REG_ACTUAL",
  "MATE1_REG_ACTUAL",
  "PROMEDIO_NOTAS",
  "PTJE_NEM",
  "PTJE_RANKING",
  "CODIGO_REGION"
)]

# 4. Filtrar puntajes válidos
datos_final <- subset(datos_final,
                      CLEC_REG_ACTUAL > 0 &
                      MATE1_REG_ACTUAL > 0)

# 5. Convertir promedio de notas a numérico
datos_final$PROMEDIO_NOTAS <- gsub(",", ".", datos_final$PROMEDIO_NOTAS)
datos_final$PROMEDIO_NOTAS <- as.numeric(datos_final$PROMEDIO_NOTAS)

# 6. Convertir variables categóricas
datos_final$tipo_colegio <- factor(datos_final$tipo_colegio)
datos_final$CODIGO_REGION <- factor(datos_final$CODIGO_REGION)

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
    unidad: "Establecimiento educacional",
    descripcion:
      "Resultados promedio por establecimiento en Matemática y Lectura, con región, comuna y dependencia administrativa.",
    contexto:
      "La base SIMCE 2° medio 2024 entrega resultados agregados a nivel de establecimiento educacional. Permite analizar puntajes promedio en Matemática y Lectura, junto con variables de ubicación y dependencia administrativa. Es útil para comparar tipos de establecimientos, regiones y comunas, y para estudiar la relación entre desempeño en distintas áreas evaluadas.",
    usos:
      "Puede usarse para análisis descriptivo, boxplots por dependencia, comparación de medias, ANOVA, análisis regional y correlación entre puntajes de Matemática y Lectura.",
    tecnicas: ["Boxplots por tipo de establecimiento", "Boxplots por región", "Histogramas", "Dispersión Lectura vs Matemática", "Correlación", "ANOVA"],
    preguntas: [
      "¿Existen diferencias en los puntajes SIMCE según tipo de establecimiento?",
      "¿Existen diferencias por región?",
      "¿Qué tan fuerte es la relación entre Lectura y Matemática?",
    ],
    variables: ["cod_reg_rbd", "cod_com_rbd", "cod_depe2", "prom_mate2m_rbd", "prom_lect2m_rbd"],
    descarga: "/archivos/simce2m2024_rbd_preliminar.csv",
    fuenteOriginal: "https://informacionestadistica.agenciaeducacion.cl/#/bases",
    script: `datos <- read.csv("simce2m2024_rbd_preliminar.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
datos_simce <- datos[, c(
  "cod_reg_rbd",
  "cod_com_rbd",
  "cod_depe2",
  "prom_lect2m_rbd",
  "prom_mate2m_rbd"
)]

# 2. Filtrar puntajes válidos
datos_simce <- subset(datos_simce,
                      prom_mate2m_rbd > 0 &
                      prom_lect2m_rbd > 0)

# 3. Crear tipo de colegio
datos_simce$tipo_colegio <- factor(datos_simce$cod_depe2,
                                   levels = c(1, 2, 3, 4),
                                   labels = c("Municipal",
                                              "Subvencionado",
                                              "Particular_Pagado",
                                              "Administracion_Delegada"))

# 4. Convertir región y comuna a factor
datos_simce$cod_reg_rbd <- factor(datos_simce$cod_reg_rbd)
datos_simce$cod_com_rbd <- factor(datos_simce$cod_com_rbd)

head(datos_simce)
summary(datos_simce)`,
  },
  {
    id: "casen-educacion-2024",
    nombre: "CASEN 2024 - Educación",
    area: "Educación",
    icono: "🎓",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Regresión logística"],
    fuenteNombre: "Observatorio Social",
    unidad: "Persona",
    descripcion:
      "Selección de variables CASEN para estudiar asistencia, escolaridad, deserción y brechas educativas.",
    contexto:
      "Esta ficha usa CASEN 2024 desde el área de educación. Está pensada para estudiantes de ciencia política que quieran analizar desigualdades educativas según edad, sexo, región, zona urbana o rural y condición socioeconómica. No busca entregar un modelo final, sino dejar una base limpia para comenzar con análisis descriptivo, comparación de grupos y modelos simples.",
    usos:
      "Sirve para estudiar asistencia escolar, años de escolaridad, alfabetización, deserción y diferencias territoriales o socioeconómicas en educación.",
    tecnicas: ["Tablas de frecuencia", "Boxplots", "ANOVA", "Regresión lineal", "Regresión logística"],
    preguntas: [
      "¿Existen diferencias en años de escolaridad entre regiones?",
      "¿La asistencia escolar cambia según zona urbana o rural?",
      "¿La pobreza se relaciona con menor escolaridad?",
      "¿Qué variables se asocian con no asistir a un establecimiento educacional?",
    ],
    variables: ["edad", "sexo", "region", "area", "esc", "asiste", "desercion", "e1", "e3", "e6a", "pobreza", "pobreza_multi"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    sugerenciasFiltros: [
      "Para trabajar solo una región: casen_educacion <- subset(casen_educacion, region == 13)",
      "Para trabajar solo población escolar: casen_educacion <- subset(casen_educacion, edad >= 6 & edad <= 18)",
      "Para comparar zona urbana y rural: usa table(casen_educacion$area) y boxplot(esc ~ area, data = casen_educacion)"
    ],
    script: `# Antes de correr este código, carga la base oficial CASEN 2024 en R.
# La base debe quedar como un objeto llamado casen_2024 en el Environment.
# No se usa load() porque el nombre del archivo puede cambiar según la descarga.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga la base CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos_casen <- as.data.frame(casen_2024)

# 1. Quitar etiquetas haven_labelled para evitar errores con ifelse(), factor() y summary()
for (v in names(datos_casen)) {
  if (inherits(datos_casen[[v]], "haven_labelled") | inherits(datos_casen[[v]], "labelled")) {
    datos_casen[[v]] <- as.numeric(zap_labels(datos_casen[[v]]))
  }
}

# 2. Función para reemplazar códigos especiales por NA
limpiar_codigos_invalidos <- function(base) {
  codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
  for (v in names(base)) {
    if (is.numeric(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  return(base)
}

# 3. Función para crear una variable simple RM vs otras regiones
crear_zona_region <- function(base) {
  if ("region" %in% names(base)) {
    base$zona_region <- ifelse(base$region == 13,
                               "Región Metropolitana",
                               "Otras regiones")
    base$zona_region <- factor(base$zona_region)
  }
  return(base)
}

# 4. Seleccionar variables de educación
variables <- c(
  "edad", "sexo", "region", "area",
  "esc", "asiste", "e1", "e3", "e6a",
  "pobreza", "pobreza_multi", "ytot", "nse", "hh_d_asis",
  "desercion"
)

variables <- variables[variables %in% names(datos_casen)]
casen_educacion <- datos_casen[, variables, drop = FALSE]
casen_educacion <- limpiar_codigos_invalidos(casen_educacion)

# 5. Filtrar información mínima
casen_educacion <- subset(casen_educacion,
                          !is.na(edad) &
                          !is.na(sexo) &
                          !is.na(region) &
                          !is.na(area))

# 6. Para escolaridad, se recomienda trabajar con personas de 15 años o más
casen_educacion <- subset(casen_educacion, edad >= 15)

if ("esc" %in% names(casen_educacion)) {
  casen_educacion <- subset(casen_educacion,
                            !is.na(esc) & esc >= 0)
}

# 7. Crear ingreso transformado si está disponible
if ("ytot" %in% names(casen_educacion)) {
  casen_educacion$log_ytot <- ifelse(!is.na(casen_educacion$ytot) &
                                       casen_educacion$ytot >= 0,
                                     log1p(casen_educacion$ytot),
                                     NA)
}

casen_educacion <- crear_zona_region(casen_educacion)

# 8. Convertir categóricas a factor
categoricas <- c("sexo", "region", "area", "asiste", "e1", "e3", "e6a",
                 "pobreza", "pobreza_multi", "nse", "hh_d_asis",
                 "desercion", "zona_region")

for (v in categoricas) {
  if (v %in% names(casen_educacion)) {
    casen_educacion[[v]] <- factor(casen_educacion[[v]])
  }
}

# 9. Bases opcionales según pregunta
# Para asistencia escolar, conviene usar población entre 5 y 24 años
casen_asistencia <- subset(casen_educacion,
                           edad >= 5 & edad <= 24)

# Para deserción, usar solo casos donde la variable no sea NA
if ("desercion" %in% names(casen_educacion)) {
  casen_desercion <- subset(casen_educacion, !is.na(desercion))
}

# 10. Revisión final
head(casen_educacion)
summary(casen_educacion)
colSums(is.na(casen_educacion))

table(casen_educacion$zona_region, useNA = "ifany")
table(casen_educacion$pobreza, useNA = "ifany")

# Base final para iniciar análisis exploratorio
datos_final_casen_educacion <- casen_educacion
`,
  },
  {
    id: "casen-salud-2024",
    nombre: "CASEN 2024 - Salud",
    area: "Salud",
    icono: "🏥",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "Comparación de proporciones", "Regresión logística"],
    fuenteNombre: "Observatorio Social",
    unidad: "Persona",
    descripcion:
      "Selección de variables CASEN para estudiar previsión de salud, acceso a atención y problemas para recibir atención médica.",
    contexto:
      "Esta ficha usa CASEN 2024 para trabajar preguntas de política pública en salud. Permite observar diferencias en acceso y problemas de atención según región, sexo, edad, pobreza, discapacidad o sistema de salud. Es útil para cursos donde se quiere conectar estadística básica con desigualdad social y diseño de políticas públicas.",
    usos:
      "Sirve para tablas de frecuencia, comparación de proporciones y regresión logística sobre problemas de acceso a salud.",
    tecnicas: ["Tablas de frecuencia", "Gráficos de barras", "Comparación de proporciones", "Regresión logística"],
    preguntas: [
      "¿Existen diferencias regionales en problemas de acceso a atención médica?",
      "¿Las personas en pobreza reportan más problemas para ser atendidas?",
      "¿El sistema de previsión de salud se relaciona con dificultades de acceso?",
      "¿La discapacidad se asocia con mayores barreras de atención?",
    ],
    variables: ["edad", "sexo", "region", "area", "s13_fonasa", "s15a", "s19b", "s19d", "s19e", "hh_d_acc", "disc_wg", "pobreza", "pobreza_multi"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    sugerenciasFiltros: [
      "Para estudiar solo personas adultas: casen_salud <- subset(casen_salud, edad >= 18)",
      "Para seleccionar una región: casen_salud <- subset(casen_salud, region == 13)",
      "Para crear una variable binaria de problema de atención, usa variables como s19b, s19d o s19e según la pregunta."
    ],
    script: `# Antes de correr este código, carga la base oficial CASEN 2024 en R.
# La base debe quedar como un objeto llamado casen_2024 en el Environment.
# No se usa load() porque el nombre del archivo puede cambiar según la descarga.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga la base CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos_casen <- as.data.frame(casen_2024)

# 1. Quitar etiquetas haven_labelled para evitar errores con ifelse(), factor() y summary()
for (v in names(datos_casen)) {
  if (inherits(datos_casen[[v]], "haven_labelled") | inherits(datos_casen[[v]], "labelled")) {
    datos_casen[[v]] <- as.numeric(zap_labels(datos_casen[[v]]))
  }
}

# 2. Función para reemplazar códigos especiales por NA
limpiar_codigos_invalidos <- function(base) {
  codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
  for (v in names(base)) {
    if (is.numeric(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  return(base)
}

# 3. Función para crear una variable simple RM vs otras regiones
crear_zona_region <- function(base) {
  if ("region" %in% names(base)) {
    base$zona_region <- ifelse(base$region == 13,
                               "Región Metropolitana",
                               "Otras regiones")
    base$zona_region <- factor(base$zona_region)
  }
  return(base)
}

# 4. Seleccionar variables relacionadas con salud y acceso
variables <- c(
  "edad", "sexo", "region", "area",
  "s13_fonasa", "s15a", "s19b", "s19d", "s19e",
  "hh_d_acc", "disc_wg", "pobreza", "pobreza_multi", "nse"
)

variables <- variables[variables %in% names(datos_casen)]
casen_salud <- datos_casen[, variables, drop = FALSE]
casen_salud <- limpiar_codigos_invalidos(casen_salud)

# 5. Filtrar información mínima
casen_salud <- subset(casen_salud,
                      !is.na(edad) &
                      !is.na(sexo) &
                      !is.na(region) &
                      !is.na(area))

casen_salud <- crear_zona_region(casen_salud)

# 6. Crear variables binarias útiles
# En estas variables, usualmente 1 = Sí y 2 = No.
if ("s19b" %in% names(casen_salud)) {
  casen_salud$problema_hora <- ifelse(casen_salud$s19b == 1, 1,
                                      ifelse(casen_salud$s19b == 2, 0, NA))
}

if ("s19d" %in% names(casen_salud)) {
  casen_salud$problema_costo <- ifelse(casen_salud$s19d == 1, 1,
                                       ifelse(casen_salud$s19d == 2, 0, NA))
}

if ("s19e" %in% names(casen_salud)) {
  casen_salud$problema_medicamentos <- ifelse(casen_salud$s19e == 1, 1,
                                              ifelse(casen_salud$s19e == 2, 0, NA))
}

if ("hh_d_acc" %in% names(casen_salud)) {
  casen_salud$carencia_acceso_salud <- ifelse(casen_salud$hh_d_acc == 1, 1,
                                              ifelse(casen_salud$hh_d_acc == 0, 0, NA))
}

# 7. Convertir categóricas a factor
categoricas <- c("sexo", "region", "area", "s13_fonasa", "s15a",
                 "s19b", "s19d", "s19e", "hh_d_acc", "disc_wg",
                 "pobreza", "pobreza_multi", "nse", "zona_region",
                 "problema_hora", "problema_costo",
                 "problema_medicamentos", "carencia_acceso_salud")

for (v in categoricas) {
  if (v %in% names(casen_salud)) {
    casen_salud[[v]] <- factor(casen_salud[[v]])
  }
}

# 8. Base opcional para análisis de problema de hora médica
# Las preguntas s19 tienen muchos NA porque solo aplican a algunas personas.
if ("problema_hora" %in% names(casen_salud)) {
  casen_salud_modelo <- subset(casen_salud,
                               !is.na(problema_hora) &
                               !is.na(pobreza) &
                               !is.na(zona_region))
  table(casen_salud_modelo$problema_hora, useNA = "ifany")
}

# 9. Revisión final
head(casen_salud)
summary(casen_salud)
colSums(is.na(casen_salud))

table(casen_salud$zona_region, useNA = "ifany")
table(casen_salud$pobreza, useNA = "ifany")

# Base final para iniciar análisis exploratorio
datos_final_casen_salud <- casen_salud
`,
  },
  {
    id: "casen-trabajo-ingresos-2024",
    nombre: "CASEN 2024 - Trabajo e ingresos",
    area: "Trabajo",
    icono: "💼",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Regresión logística"],
    fuenteNombre: "Observatorio Social",
    unidad: "Persona",
    descripcion:
      "Selección de variables CASEN para estudiar ocupación, ingresos, escolaridad y diferencias laborales.",
    contexto:
      "Esta ficha permite usar CASEN 2024 para preguntas de mercado laboral e ingresos. Es especialmente útil para ciencia política porque conecta condiciones laborales con desigualdad territorial, género, educación y pobreza. La base queda preparada para análisis descriptivo, comparación de ingresos y modelos simples.",
    usos:
      "Sirve para comparar ingresos por grupo, estudiar ocupación, analizar brechas por sexo o región y construir modelos simples de ingreso u ocupación.",
    tecnicas: ["Histogramas", "Boxplots", "ANOVA", "Regresión lineal", "Regresión logística"],
    preguntas: [
      "¿Existen diferencias de ingreso entre hombres y mujeres?",
      "¿La escolaridad se relaciona con mayores ingresos?",
      "¿La ocupación cambia según región o zona urbana/rural?",
      "¿La pobreza se relaciona con la situación laboral?",
    ],
    variables: ["edad", "sexo", "region", "area", "esc", "o1", "o3", "o6", "o15", "y1", "ytot", "pobreza", "pobreza_multi"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    sugerenciasFiltros: [
      "Para trabajar población en edad de trabajar: casen_trabajo <- subset(casen_trabajo, edad >= 15)",
      "Para una región específica: casen_trabajo <- subset(casen_trabajo, region == 13)",
      "Para ingresos menos asimétricos: usa log_ytot, creado como log(1 + ytot)."
    ],
    script: `# Antes de correr este código, carga la base oficial CASEN 2024 en R.
# La base debe quedar como un objeto llamado casen_2024 en el Environment.
# No se usa load() porque el nombre del archivo puede cambiar según la descarga.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga la base CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos_casen <- as.data.frame(casen_2024)

# 1. Quitar etiquetas haven_labelled para evitar errores con ifelse(), factor() y summary()
for (v in names(datos_casen)) {
  if (inherits(datos_casen[[v]], "haven_labelled") | inherits(datos_casen[[v]], "labelled")) {
    datos_casen[[v]] <- as.numeric(zap_labels(datos_casen[[v]]))
  }
}

# 2. Función para reemplazar códigos especiales por NA
limpiar_codigos_invalidos <- function(base) {
  codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
  for (v in names(base)) {
    if (is.numeric(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  return(base)
}

# 3. Función para crear una variable simple RM vs otras regiones
crear_zona_region <- function(base) {
  if ("region" %in% names(base)) {
    base$zona_region <- ifelse(base$region == 13,
                               "Región Metropolitana",
                               "Otras regiones")
    base$zona_region <- factor(base$zona_region)
  }
  return(base)
}

# 4. Seleccionar variables laborales y de ingreso
variables <- c(
  "edad", "sexo", "region", "area", "esc",
  "o1", "o3", "o6", "o15", "o22", "o24",
  "y1", "ytot", "pobreza", "pobreza_multi", "nse"
)

variables <- variables[variables %in% names(datos_casen)]
casen_trabajo <- datos_casen[, variables, drop = FALSE]
casen_trabajo <- limpiar_codigos_invalidos(casen_trabajo)

# 5. Filtrar población en edad de trabajar
casen_trabajo <- subset(casen_trabajo,
                        !is.na(edad) & edad >= 15 &
                        !is.na(sexo) &
                        !is.na(region) &
                        !is.na(area))

casen_trabajo <- crear_zona_region(casen_trabajo)

# 6. Crear variable ocupado
# o1 = trabajó al menos una hora; o3 = tenía empleo pero estuvo ausente.
if (all(c("o1", "o3") %in% names(casen_trabajo))) {
  casen_trabajo$ocupado <- ifelse(casen_trabajo$o1 == 1 | casen_trabajo$o3 == 1, 1,
                                  ifelse(casen_trabajo$o1 == 2 & casen_trabajo$o3 == 2, 0, NA))
}

# 7. Crear ingresos transformados sin eliminar observaciones innecesariamente
if ("ytot" %in% names(casen_trabajo)) {
  casen_trabajo$log_ytot <- ifelse(!is.na(casen_trabajo$ytot) &
                                     casen_trabajo$ytot >= 0,
                                   log1p(casen_trabajo$ytot),
                                   NA)
}

if ("y1" %in% names(casen_trabajo)) {
  casen_trabajo$log_y1 <- ifelse(!is.na(casen_trabajo$y1) &
                                   casen_trabajo$y1 > 0,
                                 log1p(casen_trabajo$y1),
                                 NA)
}

# 8. Convertir categóricas a factor
categoricas <- c("sexo", "region", "area", "o1", "o3", "o6", "o15",
                 "o22", "o24", "pobreza", "pobreza_multi", "nse",
                 "zona_region", "ocupado")

for (v in categoricas) {
  if (v %in% names(casen_trabajo)) {
    casen_trabajo[[v]] <- factor(casen_trabajo[[v]])
  }
}

# 9. Bases opcionales según pregunta
# Para estudiar ocupación:
if ("ocupado" %in% names(casen_trabajo)) {
  casen_trabajo_modelo <- subset(casen_trabajo,
                                 !is.na(ocupado) &
                                 !is.na(sexo) &
                                 !is.na(region) &
                                 !is.na(area))
  table(casen_trabajo_modelo$ocupado, useNA = "ifany")
}

# Para estudiar ingresos laborales, usar solo ocupados con ingreso del trabajo válido:
if (all(c("ocupado", "y1") %in% names(casen_trabajo))) {
  casen_ocupados_ingreso <- subset(casen_trabajo,
                                   ocupado == 1 &
                                   !is.na(y1) & y1 > 0)
}

# 10. Revisión final
head(casen_trabajo)
summary(casen_trabajo)
colSums(is.na(casen_trabajo))

table(casen_trabajo$zona_region, useNA = "ifany")
table(casen_trabajo$pobreza, useNA = "ifany")

# Base final para iniciar análisis exploratorio
datos_final_casen_trabajo <- casen_trabajo
`,
  },
  {
    id: "casen-pobreza-desigualdad-2024",
    nombre: "CASEN 2024 - Pobreza y desigualdad",
    area: "Datos sociales",
    icono: "📊",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Regresión logística"],
    fuenteNombre: "Observatorio Social",
    unidad: "Persona / hogar",
    descripcion:
      "Selección de variables CASEN para estudiar pobreza, ingreso, escolaridad, región y carencias multidimensionales.",
    contexto:
      "Esta ficha deja CASEN 2024 preparada para preguntas centrales de política pública: pobreza, desigualdad, ingresos y carencias. Es una entrada general para estudiantes de ciencia política que quieran analizar brechas sociales por territorio, sexo, edad o zona urbana/rural.",
    usos:
      "Sirve para estudiar distribución de ingresos, pobreza por ingresos, pobreza multidimensional, brechas regionales y relación entre escolaridad e ingreso.",
    tecnicas: ["Histogramas", "Boxplots", "Tablas de frecuencia", "ANOVA", "Regresión lineal", "Regresión logística"],
    preguntas: [
      "¿Qué regiones presentan mayor proporción de pobreza?",
      "¿La pobreza multidimensional cambia entre zonas urbanas y rurales?",
      "¿Existe relación entre escolaridad e ingreso?",
      "¿Qué variables se asocian con estar en situación de pobreza?",
    ],
    variables: ["edad", "sexo", "region", "area", "esc", "ytot", "yaut", "pobreza", "pobreza_multi", "nse", "hh_d_esc", "hh_d_acc", "hh_d_habit"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    sugerenciasFiltros: [
      "Para comparar RM contra regiones: usa zona_region, creada en el script.",
      "Para una región específica: casen_social <- subset(casen_social, region == 13)",
      "Para estudiar ingresos, usa log_ytot para evitar que los valores extremos dominen el gráfico."
    ],
    script: `# Antes de correr este código, carga la base oficial CASEN 2024 en R.
# La base debe quedar como un objeto llamado casen_2024 en el Environment.
# No se usa load() porque el nombre del archivo puede cambiar según la descarga.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga la base CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos_casen <- as.data.frame(casen_2024)

# 1. Quitar etiquetas haven_labelled para evitar errores con ifelse(), factor() y summary()
for (v in names(datos_casen)) {
  if (inherits(datos_casen[[v]], "haven_labelled") | inherits(datos_casen[[v]], "labelled")) {
    datos_casen[[v]] <- as.numeric(zap_labels(datos_casen[[v]]))
  }
}

# 2. Función para reemplazar códigos especiales por NA
limpiar_codigos_invalidos <- function(base) {
  codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
  for (v in names(base)) {
    if (is.numeric(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  return(base)
}

# 3. Función para crear una variable simple RM vs otras regiones
crear_zona_region <- function(base) {
  if ("region" %in% names(base)) {
    base$zona_region <- ifelse(base$region == 13,
                               "Región Metropolitana",
                               "Otras regiones")
    base$zona_region <- factor(base$zona_region)
  }
  return(base)
}

# 4. Seleccionar variables de pobreza, ingreso y desigualdad
variables <- c(
  "edad", "sexo", "region", "area", "esc",
  "ytot", "y1", "yaut", "pobreza", "pobreza_multi", "nse",
  "hh_d_asis", "hh_d_acc", "hh_d_habit", "hh_d_servbas",
  "disc_wg"
)

variables <- variables[variables %in% names(datos_casen)]
casen_social <- datos_casen[, variables, drop = FALSE]
casen_social <- limpiar_codigos_invalidos(casen_social)

# 5. Filtrar información mínima
casen_social <- subset(casen_social,
                       !is.na(edad) &
                       !is.na(sexo) &
                       !is.na(region) &
                       !is.na(area))

casen_social <- crear_zona_region(casen_social)

# 6. Crear ingreso transformado sin eliminar personas con ingreso NA
if ("ytot" %in% names(casen_social)) {
  casen_social$log_ytot <- ifelse(!is.na(casen_social$ytot) &
                                    casen_social$ytot >= 0,
                                  log1p(casen_social$ytot),
                                  NA)
}

# 7. Crear pobreza binaria
# pobreza: 1 = pobreza extrema, 2 = pobreza no extrema, 3 = no pobreza.
if ("pobreza" %in% names(casen_social)) {
  casen_social$pobre_binaria <- ifelse(casen_social$pobreza %in% c(1, 2), 1,
                                       ifelse(casen_social$pobreza == 3, 0, NA))
}

# 8. Convertir categóricas a factor
categoricas <- c("sexo", "region", "area", "pobreza", "pobreza_multi",
                 "nse", "hh_d_asis", "hh_d_acc", "hh_d_habit",
                 "hh_d_servbas", "disc_wg", "zona_region", "pobre_binaria")

for (v in categoricas) {
  if (v %in% names(casen_social)) {
    casen_social[[v]] <- factor(casen_social[[v]])
  }
}

# 9. Base opcional para modelos de pobreza
if ("pobre_binaria" %in% names(casen_social)) {
  casen_pobreza_modelo <- subset(casen_social,
                                 !is.na(pobre_binaria) &
                                 !is.na(zona_region))
  table(casen_pobreza_modelo$pobre_binaria, useNA = "ifany")
}

# 10. Revisión final
head(casen_social)
summary(casen_social)
colSums(is.na(casen_social))

table(casen_social$pobreza, useNA = "ifany")
table(casen_social$pobreza_multi, useNA = "ifany")
table(casen_social$zona_region, useNA = "ifany")

# Base final para iniciar análisis exploratorio
datos_final_casen_pobreza <- casen_social
`,
  },
  {
    id: "casen-vivienda-territorio-2024",
    nombre: "CASEN 2024 - Vivienda y territorio",
    area: "Vivienda",
    icono: "🏠",
    formato: "RData",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión logística"],
    fuenteNombre: "Observatorio Social",
    unidad: "Hogar / vivienda",
    descripcion:
      "Selección de variables CASEN para estudiar tipo de vivienda, hacinamiento, saneamiento, tenencia y calidad de vivienda.",
    contexto:
      "Esta ficha usa CASEN 2024 para estudiar condiciones habitacionales y territoriales. Es útil para preguntas sobre desigualdad urbana-rural, calidad de vivienda, hacinamiento, tenencia y carencias asociadas al hogar. Para ciencia política, permite conectar vivienda con pobreza, región y diseño de políticas sociales.",
    usos:
      "Sirve para analizar condiciones de vivienda por región, zona urbana/rural, pobreza multidimensional y carencias del hogar.",
    tecnicas: ["Tablas de frecuencia", "Gráficos de barras", "Boxplots", "ANOVA", "Regresión logística"],
    preguntas: [
      "¿Existen diferencias regionales en hacinamiento?",
      "¿La calidad de vivienda cambia entre zonas urbanas y rurales?",
      "¿La pobreza multidimensional se asocia con peores condiciones habitacionales?",
      "¿Qué hogares presentan mayor probabilidad de carencias de vivienda?",
    ],
    variables: ["region", "area", "v1", "v2", "v3", "v4", "v5", "v6", "ind_hacina", "ind_san", "ten_viv", "ind_mat", "ind_estado", "ind_cal_glob", "pobreza_multi"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    sugerenciasFiltros: [
      "Para una región específica: casen_vivienda <- subset(casen_vivienda, region == 13)",
      "Para comparar urbano/rural: usa table(casen_vivienda$area) y gráficos de barras.",
      "Para estudiar calidad global de vivienda: revisa ind_cal_glob si está disponible en tu versión de la base."
    ],
    script: `# Antes de correr este código, carga la base oficial CASEN 2024 en R.
# La base debe quedar como un objeto llamado casen_2024 en el Environment.
# No se usa load() porque el nombre del archivo puede cambiar según la descarga.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga la base CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos_casen <- as.data.frame(casen_2024)

# 1. Quitar etiquetas haven_labelled para evitar errores con ifelse(), factor() y summary()
for (v in names(datos_casen)) {
  if (inherits(datos_casen[[v]], "haven_labelled") | inherits(datos_casen[[v]], "labelled")) {
    datos_casen[[v]] <- as.numeric(zap_labels(datos_casen[[v]]))
  }
}

# 2. Función para reemplazar códigos especiales por NA
limpiar_codigos_invalidos <- function(base) {
  codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
  for (v in names(base)) {
    if (is.numeric(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  return(base)
}

# 3. Función para crear una variable simple RM vs otras regiones
crear_zona_region <- function(base) {
  if ("region" %in% names(base)) {
    base$zona_region <- ifelse(base$region == 13,
                               "Región Metropolitana",
                               "Otras regiones")
    base$zona_region <- factor(base$zona_region)
  }
  return(base)
}

# 4. Seleccionar variables de vivienda y territorio
# Se incluyen variables tradicionales de vivienda y carencias de la CASEN 2024.
variables <- c(
  "edad", "sexo", "region", "area", "tot_per_h",
  "v1", "v12", "v13", "v19", "v23_sistema",
  "ind_hacina",
  "hh_d_defcuali", "hh_d_defcuanti", "hh_d_accesi",
  "hh_d_medio", "hh_d_conec", "hh_d_seg",
  "hh_d_habitab_2015", "hh_d_servbas_2015", "hh_d_entorno_2015",
  "pobreza", "pobreza_multi", "nse"
)

variables <- variables[variables %in% names(datos_casen)]
casen_vivienda <- datos_casen[, variables, drop = FALSE]
casen_vivienda <- limpiar_codigos_invalidos(casen_vivienda)

# 5. Como este bloque analiza características del hogar/vivienda, se conserva una fila por hogar.
# Si existe pco1_a, se mantiene al jefe o jefa de hogar para no repetir la misma vivienda varias veces.
if ("pco1_a" %in% names(casen_vivienda)) {
  casen_vivienda <- subset(casen_vivienda, pco1_a == 1)
}

# 6. Filtrar información mínima
casen_vivienda <- subset(casen_vivienda,
                         !is.na(region) &
                         !is.na(area))

casen_vivienda <- crear_zona_region(casen_vivienda)

# 6. Crear variables binarias de carencias habitacionales si existen
if ("hh_d_defcuali" %in% names(casen_vivienda)) {
  casen_vivienda$deficit_cualitativo <- ifelse(casen_vivienda$hh_d_defcuali == 1, 1,
                                               ifelse(casen_vivienda$hh_d_defcuali == 0, 0, NA))
}

if ("hh_d_defcuanti" %in% names(casen_vivienda)) {
  casen_vivienda$deficit_cuantitativo <- ifelse(casen_vivienda$hh_d_defcuanti == 1, 1,
                                                ifelse(casen_vivienda$hh_d_defcuanti == 0, 0, NA))
}

if ("hh_d_conec" %in% names(casen_vivienda)) {
  casen_vivienda$carencia_conectividad <- ifelse(casen_vivienda$hh_d_conec == 1, 1,
                                                 ifelse(casen_vivienda$hh_d_conec == 0, 0, NA))
}

if ("hh_d_servbas_2015" %in% names(casen_vivienda)) {
  casen_vivienda$carencia_servicios_basicos_2015 <- ifelse(casen_vivienda$hh_d_servbas_2015 == 1, 1,
                                                           ifelse(casen_vivienda$hh_d_servbas_2015 == 0, 0, NA))
}

# 7. Convertir categóricas a factor
categoricas <- c("sexo", "region", "area", "v1", "v12", "v13", "v19",
                 "v23_sistema", "pobreza", "pobreza_multi", "nse",
                 "zona_region", "hh_d_defcuali", "hh_d_defcuanti",
                 "hh_d_accesi", "hh_d_medio", "hh_d_conec", "hh_d_seg",
                 "hh_d_habitab_2015", "hh_d_servbas_2015", "hh_d_entorno_2015",
                 "deficit_cualitativo", "deficit_cuantitativo",
                 "carencia_conectividad", "carencia_servicios_basicos_2015")

for (v in categoricas) {
  if (v %in% names(casen_vivienda)) {
    casen_vivienda[[v]] <- factor(casen_vivienda[[v]])
  }
}

# 8. Bases opcionales según pregunta
casen_vivienda_rural <- subset(casen_vivienda, area == 2)
casen_vivienda_rm <- subset(casen_vivienda, region == 13)

# 9. Revisión final
head(casen_vivienda)
summary(casen_vivienda)
colSums(is.na(casen_vivienda))

table(casen_vivienda$area, useNA = "ifany")
table(casen_vivienda$zona_region, useNA = "ifany")

if ("deficit_cualitativo" %in% names(casen_vivienda)) {
  table(casen_vivienda$deficit_cualitativo, useNA = "ifany")
}

# Base final para iniciar análisis exploratorio
datos_final_casen_vivienda <- casen_vivienda
`,
  },
  {
    id: "sismos-chile-mapa-interactivo",
    nombre: "Sismos en Chile - mapa interactivo y asignación regional",
    area: "Medio ambiente",
    icono: "🌎",
    formato: "XLSX / CSV / HTML / R",
    tamano: "Mediana",
    analisis: ["Análisis espacial", "Mapas interactivos", "Exploratorio", "ANOVA", "Kruskal-Wallis", "Chi-cuadrado"],
    fuenteNombre: "Base preparada para el repertorio / datos de sismos con coordenadas",
    unidad: "Evento sísmico",
    descripcion:
      "Base de sismos en Chile con fecha, latitud, longitud, profundidad y magnitud. La plantilla permite asignar cada evento a una región mediante polígonos espaciales y construir un mapa interactivo por región.",
    contexto:
      "Esta ficha está pensada como un proyecto aplicado de análisis espacial. A diferencia de una base tradicional, aquí no basta con cargar datos y hacer tablas: primero se convierten las coordenadas en puntos, luego se cruzan con los polígonos de las regiones de Chile y finalmente se construye una variable de región asignada. Los sismos ubicados en el mar se mantienen en su coordenada real, pero se asignan a la región más cercana para poder resumir resultados por territorio.",
    usos:
      "Sirve para aprender a trabajar con coordenadas geográficas, mapas de Chile, asignación espacial por región, resúmenes territoriales, comparación entre macrozonas y visualización interactiva. También permite formular preguntas de investigación sobre magnitud, profundidad y concentración territorial de eventos sísmicos.",
    notaMetodologica:
      "Los epicentros que aparecen en el mar no se deben mover dentro de la región. La coordenada muestra dónde ocurrió el sismo. La región asignada se usa solo para resumir y comparar resultados por territorio.",
    notaMapa:
      "Si aparece un error 404 en esta sección, no es un problema del código de React: significa que el archivo mapa_interactivo_regional_sismos.html todavía no está copiado en public/archivos o tiene otro nombre.",
    checklistArchivos: [
      "sismos_chile_limpios.xlsx: base de entrada que se lee desde R.",
      "script_sismos_chile.R: script completo que genera la base final, resúmenes, gráficos y mapa HTML.",
      "sismos_chile_con_region.csv: base final con región asignada, exportada desde R.",
      "sismos_chile_con_region.xlsx: archivo Excel con base final y tablas resumen.",
      "mapa_interactivo_regional_sismos.html: mapa que se muestra dentro de la ficha. Este archivo debe estar obligatoriamente en public/archivos."
    ],
    tecnicas: [
      "Lectura de coordenadas",
      "Objetos espaciales sf",
      "Cruce punto-polígono",
      "Asignación por región cercana",
      "Mapas coropléticos",
      "Mapa interactivo HTML",
      "ANOVA",
      "Kruskal-Wallis",
      "Chi-cuadrado"
    ],
    preguntas: [
      "¿Qué regiones concentran mayor cantidad de sismos registrados?",
      "¿La profundidad de los sismos cambia según macrozona?",
      "¿La magnitud promedio varía entre regiones o macrozonas?",
      "¿Qué regiones concentran más eventos de magnitud 5 o superior?",
      "¿Cómo se deben tratar los sismos que ocurren en el mar al hacer análisis regional?"
    ],
    variables: [
      "fecha",
      "latitud",
      "longitud",
      "profundidad",
      "magnitud",
      "region_asignada",
      "metodo_asignacion_region",
      "macrozona",
      "sismo_mayor_5",
      "sismo_mayor_6"
    ],
    descarga: "/archivos/sismos_chile_limpios.xlsx",
    fuenteOriginal: "https://www.sismologia.cl/",
    mapaInteractivo: "/archivos/mapa_interactivo_regional_sismos.html",
    scriptDescarga: "/archivos/script_sismos_chile.R",
    archivos: [
      { nombre: "Base original limpia (XLSX)", url: "/archivos/sismos_chile_limpios.xlsx", tipo: "descarga" },
      { nombre: "Base con región asignada (CSV)", url: "/archivos/sismos_chile_con_region.csv", tipo: "descarga" },
      { nombre: "Base y resúmenes finales (XLSX)", url: "/archivos/sismos_chile_con_region.xlsx", tipo: "descarga" },
      { nombre: "Script completo en R", url: "/archivos/script_sismos_chile.R", tipo: "descarga" },
      { nombre: "Abrir mapa interactivo", url: "/archivos/mapa_interactivo_regional_sismos.html", tipo: "abrir" }
    ],
    guiaManual: [
      {
        titulo: "Ubicar la carpeta de trabajo en R",
        texto: "Antes de correr el script, la base sismos_chile_limpios.xlsx debe estar en la misma carpeta de trabajo de R. Esto evita errores de ruta y permite que el script genere todos los archivos en un solo lugar.",
        codigo: `# Revisar carpeta actual
getwd()

# Cambiar carpeta si es necesario
# setwd("C:/Users/SuperUsuario/Downloads")

# Verificar que la base está en la carpeta
file.exists("sismos_chile_limpios.xlsx")`,
        resultado: "El resultado de file.exists debe ser TRUE. Si da FALSE, la base no está en la carpeta correcta o el nombre está escrito distinto."
      },
      {
        titulo: "Correr el script completo",
        texto: "Esta ficha tiene un script largo porque construye variables espaciales, descarga regiones de Chile, genera resúmenes y crea un mapa interactivo. Por eso lo correcto es descargar el script completo y correrlo desde R.",
        codigo: `# Correr el script completo
source("script_sismos_chile.R")`,
        resultado: "R debería generar la base con región asignada, el Excel de resúmenes, gráficos PNG y el archivo HTML del mapa interactivo."
      },
      {
        titulo: "Revisar que se crearon los archivos finales",
        texto: "Después de correr el script, hay que revisar que los archivos existan. Esto es especialmente importante para el mapa, porque la vista previa de la página depende del archivo HTML.",
        codigo: `file.exists("sismos_chile_con_region.csv")
file.exists("sismos_chile_con_region.xlsx")
file.exists("mapa_interactivo_regional_sismos.html")`,
        resultado: "Los tres resultados deberían ser TRUE. Si el mapa da FALSE, no aparecerá en la ficha y se verá un error 404."
      },
      {
        titulo: "Copiar los archivos a la página",
        texto: "Para que la página web pueda mostrar y descargar los archivos, debes copiarlos a la carpeta public/archivos del proyecto React.",
        codigo: `# Ruta esperada en Windows
# C:/Users/SuperUsuario/repertorio-bases/public/archivos

# Archivos que deben copiarse:
# sismos_chile_limpios.xlsx
# sismos_chile_con_region.csv
# sismos_chile_con_region.xlsx
# mapa_interactivo_regional_sismos.html
# script_sismos_chile.R`,
        resultado: "Cuando estos archivos estén en public/archivos, la vista previa del mapa, los botones de descarga y el botón de pantalla completa deberían funcionar."
      },
      {
        titulo: "Empezar el análisis estadístico",
        texto: "Con la base final se pueden construir preguntas de investigación. Por ejemplo, comparar magnitud o profundidad según macrozona, revisar qué regiones concentran más eventos o estudiar los sismos de magnitud 5 o más.",
        codigo: `datos <- read.csv("sismos_chile_con_region.csv")

# Cantidad por región
table(datos$region_asignada)

# Profundidad por macrozona
kruskal.test(profundidad ~ macrozona, data = datos)

# Eventos fuertes por macrozona
table(datos$macrozona, datos$sismo_mayor_5)`,
        resultado: "La base queda lista para análisis descriptivo, mapas, pruebas no paramétricas, ANOVA y comparación de proporciones."
      }
    ],
    pasosProyecto: [
      {
        titulo: "1. Cargar la base de sismos",
        texto: "Se parte desde una base limpia con fecha, latitud, longitud, profundidad y magnitud. Antes de mapear, se revisa que las coordenadas sean numéricas y que no existan valores faltantes en las variables principales."
      },
      {
        titulo: "2. Descargar las regiones de Chile desde R",
        texto: "El script usa geodata para obtener los polígonos administrativos de Chile. Cada región se representa como una geometría, es decir, una forma espacial que luego se cruza con los puntos de los sismos."
      },
      {
        titulo: "3. Convertir cada sismo en un punto espacial",
        texto: "Cada fila de la base se transforma en un punto usando longitud y latitud. Esto permite trabajar con sf y comparar la ubicación de cada evento con los límites regionales."
      },
      {
        titulo: "4. Asignar región mediante cruce espacial",
        texto: "Si el punto cae dentro de una región, se asigna esa región. Si cae en el mar, se asigna la región más cercana, pero sin mover el punto de su coordenada real."
      },
      {
        titulo: "5. Crear resúmenes por región y macrozona",
        texto: "Con la región asignada se calcula cantidad de sismos, magnitud promedio, magnitud máxima, profundidad promedio y cantidad de eventos sobre magnitud 5 o 6."
      },
      {
        titulo: "6. Construir el mapa interactivo",
        texto: "El mapa principal muestra Chile por regiones, coloreadas según cantidad de sismos. Al hacer clic en una región, se abre una ventana flotante con un mapa específico de esa región y sus eventos."
      },
      {
        titulo: "7. Exportar resultados",
        texto: "El script guarda una base final con región asignada, un Excel con resúmenes y un archivo HTML del mapa interactivo para abrirlo o subirlo a la página."
      }
    ],
    sugerenciasFiltros: [
      "Para analizar solo eventos fuertes: sismos_fuertes <- subset(sismos_final, magnitud >= 5)",
      "Para trabajar una región: sismos_valparaiso <- subset(sismos_final, region_asignada == 'Valparaíso')",
      "Para comparar profundidad entre macrozonas: kruskal.test(profundidad ~ macrozona, data = sismos_final)",
      "Para revisar sismos en el mar: table(sismos_final$metodo_asignacion_region)"
    ],
    script: `# ============================================================
# DATASET: Sismos en Chile
# Objetivo: asignar región a cada sismo y construir el mapa interactivo
# ============================================================

# Esta plantilla se trabaja en dos niveles:
# 1. En R se corre el script completo.
# 2. En la página se visualiza el mapa y se descargan los resultados.

# ARCHIVO DE ENTRADA
# Debe estar en la misma carpeta de trabajo de R:
# sismos_chile_limpios.xlsx

# SCRIPT COMPLETO
# Descárgalo desde el botón "Script completo en R" y ejecútalo así:
source("script_sismos_chile.R")

# ARCHIVOS QUE DEBERÍA GENERAR EL SCRIPT
# sismos_chile_con_region.csv
# sismos_chile_con_region.xlsx
# mapa_interactivo_regional_sismos.html
# mapa_01_cantidad_region.png
# mapa_02_sismos_fuertes.png

# VERIFICAR QUE EL MAPA EXISTE
file.exists("mapa_interactivo_regional_sismos.html")

# SI EL MAPA SE VE COMO 404 EN LA PÁGINA
# Copia este archivo a:
# C:/Users/SuperUsuario/repertorio-bases/public/archivos

# CARGAR LA BASE FINAL PARA ANALIZAR
sismos_final <- read.csv("sismos_chile_con_region.csv")

# EJEMPLOS DE ANÁLISIS
# Cantidad de sismos por región
table(sismos_final$region_asignada)

# Comparar profundidad según macrozona
kruskal.test(profundidad ~ macrozona, data = sismos_final)

# Revisar sismos fuertes por macrozona
table(sismos_final$macrozona, sismos_final$sismo_mayor_5)

# NOTA METODOLÓGICA
# Los sismos ubicados en el mar no se mueven dentro de la región.
# Se mantienen en su coordenada real y solo se asignan a la región más cercana
# para poder construir resúmenes territoriales.`
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
    unidad: "Registro diario",
    descripcion:
      "Registros diarios validados de monitoreo ambiental para trabajar por mes, año y estación.",
    contexto:
      "Esta base corresponde a registros de calidad del aire obtenidos desde SINCA. Permite estudiar variaciones ambientales a través del tiempo sin entrar necesariamente en modelos formales de series de tiempo. Es útil para comparar meses, años o estaciones del año mediante análisis exploratorio y modelos simples de comparación de grupos.",
    usos:
      "Puede usarse para análisis temporal básico, histogramas, boxplots por mes, comparación por estación, ANOVA y estudio descriptivo de patrones ambientales.",
    tecnicas: ["Histogramas", "Boxplots por mes", "Boxplots por año", "Boxplots por estación", "ANOVA por mes", "TukeyHSD"],
    preguntas: ["¿Existen diferencias entre meses?", "¿Existen diferencias por estación?", "¿Cómo evolucionan los registros validados en el tiempo?"],
    variables: ["fecha", "hora", "reg_validos", "fecha_mes", "anio", "mes", "estacion"],
    descarga: "/archivos/datos_final_aire_limpios.csv",
    fuenteOriginal: "https://sinca.mma.gob.cl/index.php/",
    script: `datos <- read.csv("datos_final_aire_limpios.csv",
                  sep = ",",
                  header = TRUE,
                  stringsAsFactors = FALSE)

# 1. Eliminar columnas completamente vacías
datos <- datos[, colSums(is.na(datos)) < nrow(datos)]
if ("X" %in% names(datos)) datos$X <- NULL

# 2. Limpiar fecha
datos$fecha <- trimws(as.character(datos$fecha))
datos$fecha <- gsub("[^0-9]", "", datos$fecha)

# 3. Función para limpiar números escritos como texto
limpiar_numerica <- function(x) {
  x <- trimws(as.character(x))
  x[x == ""] <- NA
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

datos$reg_validos <- limpiar_numerica(datos$reg_validos)
datos$fecha_mes <- as.Date(datos$fecha, format = "%y%m%d")

# 4. Filtrar filas válidas
datos_validos <- subset(datos,
                        !is.na(fecha_mes) &
                        !is.na(reg_validos))

# 5. Crear variables temporales
datos_validos$anio <- format(datos_validos$fecha_mes, "%Y")
datos_validos$mes_num <- format(datos_validos$fecha_mes, "%m")
datos_validos$mes <- factor(datos_validos$mes_num,
                            levels = c("01","02","03","04","05","06","07","08","09","10","11","12"),
                            labels = c("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"))

datos_validos$estacion <- ifelse(datos_validos$mes_num %in% c("12","01","02"), "Verano",
                          ifelse(datos_validos$mes_num %in% c("03","04","05"), "Otoño",
                          ifelse(datos_validos$mes_num %in% c("06","07","08"), "Invierno", "Primavera")))

datos_validos$estacion <- factor(datos_validos$estacion,
                                 levels = c("Verano", "Otoño", "Invierno", "Primavera"))

head(datos_validos)
summary(datos_validos)`,
  },
  {
    id: "egresos-hospitalarios-2020",
    nombre: "Egresos hospitalarios 2020",
    area: "Salud",
    icono: "🏥",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Regresión logística"],
    fuenteNombre: "DEIS / MINSAL",
    unidad: "Egreso hospitalario",
    descripcion:
      "Registros de egresos hospitalarios con información de sexo, edad, región, diagnóstico, previsión, días de estadía y condición de egreso.",
    contexto:
      "La base de egresos hospitalarios permite estudiar eventos de hospitalización en Chile. Cada observación corresponde a un egreso hospitalario y contiene información demográfica, territorial y clínica. Es útil para analizar diferencias en duración de estadías, distribución de diagnósticos, previsión de salud, egresos por región y probabilidad de intervención quirúrgica.",
    usos:
      "Puede utilizarse para análisis exploratorio, tablas de frecuencia, comparación de días de estadía por región o previsión, ANOVA, regresión lineal para duración de estadía y regresión logística para estudiar intervención quirúrgica o condición de egreso.",
    tecnicas: ["Tablas de frecuencia", "Histogramas", "Boxplots por región", "ANOVA", "Regresión lineal", "Regresión logística"],
    preguntas: [
      "¿Existen diferencias en los días de estadía según región?",
      "¿Los días de estadía cambian según previsión de salud?",
      "¿La probabilidad de intervención quirúrgica cambia según sexo o grupo de edad?",
      "¿Qué diagnósticos aparecen con mayor frecuencia?",
    ],
    variables: ["SEXO", "GRUPO_EDAD", "GLOSA_REGION_RESIDENCIA", "GLOSA_COMUNA_RESIDENCIA", "GLOSA_PREVISION", "ANO_EGRESO", "DIAG1", "DIAS_ESTADA", "CONDICION_EGRESO", "INTERV_Q"],
    descarga: "",
    fuenteOriginal: "https://deis.minsal.cl/#datos-abiertos",
    script: `datos <- read.csv("EGRE_DATOS_ABIERTOS_2020.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
egresos <- datos[, c(
  "SEXO",
  "GRUPO_EDAD",
  "ETNIA",
  "GLOSA_PAIS_ORIGEN",
  "COMUNA_RESIDENCIA",
  "GLOSA_COMUNA_RESIDENCIA",
  "REGION_RESIDENCIA",
  "GLOSA_REGION_RESIDENCIA",
  "PREVISION",
  "GLOSA_PREVISION",
  "ANO_EGRESO",
  "DIAG1",
  "DIAS_ESTADA",
  "CONDICION_EGRESO",
  "INTERV_Q",
  "PROCED"
)]

# 2. Filtrar información básica válida
egresos <- subset(egresos,
                  !is.na(SEXO) &
                  !is.na(GRUPO_EDAD) &
                  !is.na(GLOSA_REGION_RESIDENCIA) &
                  !is.na(DIAG1) &
                  !is.na(DIAS_ESTADA))

egresos <- subset(egresos, DIAS_ESTADA >= 0)

# 3. Crear capítulo diagnóstico desde CIE-10
egresos$diag_capitulo <- substr(egresos$DIAG1, 1, 1)

# 4. Convertir variables categóricas
egresos$SEXO <- factor(egresos$SEXO)
egresos$GRUPO_EDAD <- factor(egresos$GRUPO_EDAD)
egresos$GLOSA_REGION_RESIDENCIA <- factor(egresos$GLOSA_REGION_RESIDENCIA)
egresos$GLOSA_PREVISION <- factor(egresos$GLOSA_PREVISION)
egresos$CONDICION_EGRESO <- factor(egresos$CONDICION_EGRESO)
egresos$INTERV_Q <- factor(egresos$INTERV_Q)
egresos$diag_capitulo <- factor(egresos$diag_capitulo)

head(egresos)
summary(egresos)`,
  },
  {
    id: "defunciones-semana-epidemiologica",
    nombre: "Defunciones por semana epidemiológica",
    area: "Salud",
    icono: "🩺",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "Análisis temporal básico", "Tasas", "Regresión lineal"],
    fuenteNombre: "MINSAL / Datos.gob.cl",
    unidad: "Registro agregado por semana, sexo, edad y región",
    descripcion:
      "Defunciones observadas agregadas por año, semana epidemiológica, sexo, grupo de edad y región.",
    contexto:
      "Esta base permite estudiar mortalidad de forma agregada por semana epidemiológica. Cada fila resume un grupo definido por año, semana, sexo, edad y región. Es útil para observar evolución temporal básica, diferencias territoriales y tasas de mortalidad usando población como denominador.",
    usos:
      "Puede utilizarse para análisis temporal básico, cálculo de tasas, comparación por región, comparación por grupo etario y regresión lineal simple para observar tendencias.",
    tecnicas: ["Tablas por región", "Gráficos por semana", "Tasas por 100.000 habitantes", "Boxplots por año", "Regresión lineal"],
    preguntas: ["¿Qué regiones presentan mayor tasa de mortalidad?", "¿Cómo cambian las defunciones por semana epidemiológica?", "¿Existen diferencias por grupo de edad o sexo?", "¿La tasa de mortalidad cambia entre años?"],
    variables: ["ANO_ESTADISTICO", "SEMANA_ESTADISTICA", "GRUPO_EDAD", "SEXO", "REGION", "POBLACION", "MUERTES_OBS", "tasa_mortalidad"],
    descarga: "/archivos/def_semana_epidemiologica.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("def_semana_epidemiologica.csv",
                  sep = "|",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
defunciones <- datos[, c(
  "ANO_ESTADISTICO",
  "SEMANA_ESTADISTICA",
  "GRUPO_EDAD",
  "SEXO",
  "REGION",
  "POBLACION",
  "MUERTES_OBS"
)]

# 2. Filtrar datos completos y coherentes
defunciones <- subset(defunciones,
                      !is.na(ANO_ESTADISTICO) &
                      !is.na(SEMANA_ESTADISTICA) &
                      !is.na(GRUPO_EDAD) &
                      !is.na(SEXO) &
                      !is.na(REGION) &
                      !is.na(POBLACION) &
                      !is.na(MUERTES_OBS))

defunciones <- subset(defunciones,
                      POBLACION > 0 &
                      MUERTES_OBS >= 0 &
                      SEMANA_ESTADISTICA >= 1 &
                      SEMANA_ESTADISTICA <= 53)

# 3. Crear tasa por 100.000 habitantes
defunciones$tasa_mortalidad <- (defunciones$MUERTES_OBS / defunciones$POBLACION) * 100000

# 4. Convertir variables categóricas
defunciones$ANO_ESTADISTICO <- factor(defunciones$ANO_ESTADISTICO)
defunciones$GRUPO_EDAD <- factor(defunciones$GRUPO_EDAD)
defunciones$REGION <- factor(defunciones$REGION)
defunciones$SEXO <- factor(defunciones$SEXO,
                           levels = c(1, 2),
                           labels = c("Hombre", "Mujer"))

head(defunciones)
summary(defunciones)`,
  },
  {
    id: "ene-2026",
    nombre: "Encuesta Nacional de Empleo 2026",
    area: "Trabajo",
    icono: "💼",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "Regresión logística", "ANOVA", "Comparación de proporciones"],
    fuenteNombre: "INE",
    unidad: "Persona",
    descripcion:
      "Base de la Encuesta Nacional de Empleo con información sobre ocupación, desocupación, informalidad, horas trabajadas, sexo, edad, región y educación.",
    contexto:
      "La Encuesta Nacional de Empleo permite estudiar la situación laboral de la población en Chile. Incluye variables sobre actividad laboral, ocupación, desocupación, informalidad, horas trabajadas, categoría ocupacional y características sociodemográficas. Es una base útil para analizar desigualdades laborales por sexo, edad, región o nivel educacional.",
    usos:
      "Puede utilizarse para análisis exploratorio, tablas de contingencia, comparación de proporciones, regresión logística para ocupación o informalidad, ANOVA para horas trabajadas y análisis por región.",
    tecnicas: ["Tablas de contingencia", "Gráficos de barras", "Boxplots de horas", "Comparación de proporciones", "Regresión logística", "ANOVA"],
    preguntas: ["¿Existen diferencias en ocupación entre hombres y mujeres?", "¿La informalidad laboral cambia según región?", "¿Las horas trabajadas varían según categoría ocupacional?", "¿La probabilidad de estar ocupado cambia según edad, sexo o educación?"],
    variables: ["ano_trimestre", "mes_central", "region", "sexo", "edad", "nivel", "activ", "cae_general", "categoria_ocupacion", "habituales", "efectivas", "ocup_form", "sector", "fact_cal"],
    descarga: "/archivos/ene-2026-02-efm.csv",
    fuenteOriginal: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral",
    script: `datos <- read.csv("ene-2026-02-efm.csv",
                  sep = ";",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
ene <- datos[, c(
  "ano_trimestre",
  "mes_central",
  "ano_encuesta",
  "mes_encuesta",
  "region",
  "sexo",
  "edad",
  "nivel",
  "activ",
  "cae_general",
  "categoria_ocupacion",
  "habituales",
  "efectivas",
  "ocup_form",
  "sector",
  "fact_cal"
)]

# 2. Convertir variables numéricas escritas como texto
ene$fact_cal <- gsub(",", ".", ene$fact_cal)
ene$fact_cal <- as.numeric(ene$fact_cal)
ene$habituales <- as.numeric(ene$habituales)
ene$efectivas <- as.numeric(ene$efectivas)

# 3. Filtrar población en edad de trabajar y variables básicas completas
ene <- subset(ene,
              !is.na(edad) &
              edad >= 15 &
              !is.na(region) &
              !is.na(sexo) &
              !is.na(activ))

# 4. Crear variables interpretables
ene$sexo <- factor(ene$sexo,
                   levels = c(1, 2),
                   labels = c("Hombre", "Mujer"))
ene$region <- factor(ene$region)
ene$actividad <- factor(ene$activ,
                        levels = c(1, 2, 3),
                        labels = c("Ocupado", "Desocupado", "Inactivo"))
ene$ocupado <- ifelse(ene$activ == 1, 1, 0)
ene$ocup_form <- factor(ene$ocup_form)
ene$nivel <- factor(ene$nivel)

head(ene)
summary(ene)`,
  },
  {
    id: "pib-regional-trimestral",
    nombre: "PIB regional trimestral",
    area: "Economía",
    icono: "💰",
    formato: "XLSX",
    tamano: "Mediana",
    analisis: ["Exploratorio", "Análisis temporal básico", "Regresión lineal", "ANOVA"],
    fuenteNombre: "Banco Central de Chile",
    unidad: "Región-trimestre",
    descripcion:
      "Producto Interno Bruto trimestral por región, en volumen a precios encadenados.",
    contexto:
      "Esta base contiene información del Producto Interno Bruto regional con frecuencia trimestral. Permite observar diferencias en actividad económica entre regiones y su evolución en el tiempo. Es útil para análisis temporal básico, comparación entre regiones y estudio de tendencias económicas sin necesidad de entrar inmediatamente en modelos avanzados de series de tiempo.",
    usos:
      "Puede utilizarse para gráficos temporales, comparación de PIB promedio por región, análisis de crecimiento, regresión lineal simple y ANOVA para comparar regiones.",
    tecnicas: ["Gráficos temporales", "Boxplots por región", "Comparación por trimestre", "Regresión lineal", "ANOVA"],
    preguntas: ["¿Qué regiones tienen mayor PIB trimestral?", "¿Cómo ha evolucionado el PIB regional entre 2013 y 2025?", "¿Existen diferencias promedio entre regiones?", "¿Qué regiones muestran mayor crecimiento?"],
    variables: ["region", "periodo", "pib", "anio", "trimestre"],
    descarga: "/archivos/CCNN2018_PIB_REGIONAL_T.xlsx",
    fuenteOriginal: "https://si3.bcentral.cl/Siete",
    script: `library(readxl)
library(dplyr)
library(tidyr)

datos <- read_excel("CCNN2018_PIB_REGIONAL_T.xlsx")

# 1. Revisar estructura original
names(datos)
head(datos)

# 2. Renombrar primera columna
names(datos)[1] <- "region"

# 3. Pasar de formato ancho a formato largo
pib_regional <- datos %>%
  pivot_longer(
    cols = -region,
    names_to = "periodo",
    values_to = "pib"
  )

# 4. Limpiar variables
pib_regional$region <- trimws(as.character(pib_regional$region))
pib_regional$pib <- as.numeric(pib_regional$pib)
pib_regional <- subset(pib_regional,
                       !is.na(region) &
                       !is.na(periodo) &
                       !is.na(pib))

# 5. Crear año y trimestre
pib_regional$periodo <- as.character(pib_regional$periodo)
pib_regional$anio <- gsub(".*([0-9]{4}).*", "\\\\1", pib_regional$periodo)
pib_regional$trimestre <- ifelse(grepl("I\\\\.", pib_regional$periodo), "I",
                          ifelse(grepl("II\\\\.", pib_regional$periodo), "II",
                          ifelse(grepl("III\\\\.", pib_regional$periodo), "III",
                          ifelse(grepl("IV\\\\.", pib_regional$periodo), "IV", NA))))
pib_regional$anio <- as.numeric(pib_regional$anio)
pib_regional$trimestre <- factor(pib_regional$trimestre,
                                 levels = c("I", "II", "III", "IV"))
pib_regional$region <- factor(pib_regional$region)

head(pib_regional)
summary(pib_regional)`,
  },
  {
    id: "rem20-indicadores-hospitalarios",
    nombre: "REM20 indicadores hospitalarios",
    area: "Salud",
    icono: "🏥",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "MINSAL / DEIS",
    unidad: "Establecimiento-mes",
    descripcion:
      "Indicadores hospitalarios mensuales por establecimiento y área funcional, incluyendo camas, egresos, días de estadía, letalidad e índice ocupacional.",
    contexto:
      "Esta base reúne indicadores hospitalarios que permiten caracterizar el funcionamiento de establecimientos de salud. Es útil para estudiar ocupación de camas, egresos, días de estadía y diferencias entre servicios o establecimientos. Para fines docentes permite practicar limpieza de datos de salud y comparación de indicadores entre grupos.",
    usos:
      "Puede usarse para análisis exploratorio, comparación de promedios por establecimiento o área funcional, ANOVA y regresión lineal para estudiar indicadores como días de estadía u ocupación.",
    tecnicas: ["Tablas descriptivas", "Boxplots", "ANOVA", "Regresión lineal", "Gráficos por mes"],
    preguntas: ["¿Qué establecimientos tienen mayor ocupación de camas?", "¿Existen diferencias en días de estadía según área funcional?", "¿Cómo cambian los indicadores hospitalarios por mes?"],
    variables: ["anio", "mes", "region", "establecimiento", "area_funcional", "camas", "egresos", "dias_estada", "letalidad", "indice_ocupacional", "promedio_dias_estada", "indice_rotacion", "intervalo_sustitucion"],
    descarga: "/archivos/indicadores_rem20_20260425.csv",
    fuenteOriginal: "https://deis.minsal.cl/#datos-abiertos",
    script: `datos <- read.csv("indicadores_rem20_20260425.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Revisar nombres originales
names(datos)

# 2. Pasar nombres a minúscula para trabajar más cómodo
names(datos) <- tolower(names(datos))

# 3. Seleccionar variables relevantes si existen
vars <- c("anio", "año", "ano", "mes", "region", "establecimiento",
          "area_funcional", "camas", "egresos", "dias_estada",
          "letalidad", "indice_ocupacional", "promedio_dias_estada",
          "indice_rotacion", "intervalo_sustitucion")
vars <- vars[vars %in% names(datos)]
rem20 <- datos[, vars]

# 4. Función para convertir números escritos como texto
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

# 5. Convertir columnas numéricas posibles
for (v in names(rem20)) {
  if (grepl("cama|egreso|dias|letalidad|ocupacional|rotacion|sustitucion", v)) {
    rem20[[v]] <- limpiar_num(rem20[[v]])
  }
}

# 6. Filtrar filas con información mínima
rem20 <- rem20[rowSums(is.na(rem20)) < ncol(rem20), ]

# 8. Convertir variables categóricas
for (v in c("region", "establecimiento", "area_funcional", "mes")) {
  if (v %in% names(rem20)) rem20[[v]] <- factor(rem20[[v]])
}

head(rem20)
summary(rem20)`,
  },
  {
    id: "precios-mayoristas-frutas-hortalizas-2026",
    nombre: "Precios mayoristas de frutas y hortalizas 2026",
    area: "Agricultura",
    icono: "🍎",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "Datos.gob.cl / ODEPA",
    unidad: "Registro de precio",
    descripcion:
      "Precios mayoristas de frutas, hortalizas y tubérculos por fecha, región, mercado, producto, variedad, calidad, origen, volumen y precio.",
    contexto:
      "Esta base permite estudiar el comportamiento de precios agrícolas en mercados mayoristas. Es útil para analizar diferencias de precios entre regiones, mercados, productos o variedades, además de observar cambios a través del tiempo dentro de un año.",
    usos:
      "Puede usarse para análisis exploratorio de precios, comparación entre productos, ANOVA por mercado o región, y regresión lineal simple entre precio y tiempo.",
    tecnicas: ["Histogramas de precios", "Boxplots por producto", "ANOVA", "Regresión lineal", "Tablas por mercado"],
    preguntas: ["¿Qué productos tienen mayor precio promedio?", "¿Existen diferencias de precio entre mercados o regiones?", "¿Cómo cambia el precio a través del tiempo?"],
    variables: ["fecha", "region", "mercado", "producto", "variedad", "calidad", "origen", "volumen", "precio"],
    descarga: "/archivos/precio_mayorista_fruta-hortaliza_2026.csv",
    fuenteOriginal: "https://datos.gob.cl/dataset/precios-mayoristas-de-frutas-y-hortalizas",
    script: `datos <- read.csv("precio_mayorista_fruta-hortaliza_2026.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Revisar nombres y estructura
names(datos)
head(datos)

# 2. Pasar nombres a minúscula
names(datos) <- tolower(names(datos))

# 3. Seleccionar variables principales según estén disponibles
vars <- c("fecha", "region", "mercado", "producto", "variedad",
          "calidad", "origen", "volumen", "precio")
vars <- vars[vars %in% names(datos)]
precios <- datos[, vars]

# 4. Función para limpiar números
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub("\\\\.", "", x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

# 5. Convertir precio y volumen si existen
if ("precio" %in% names(precios)) precios$precio <- limpiar_num(precios$precio)
if ("volumen" %in% names(precios)) precios$volumen <- limpiar_num(precios$volumen)

# 6. Crear fecha, año y mes si existe fecha
if ("fecha" %in% names(precios)) {
  precios$fecha <- as.Date(precios$fecha)
  precios$anio <- format(precios$fecha, "%Y")
  precios$mes <- format(precios$fecha, "%m")
}

# 7. Filtrar registros con precio válido
if ("precio" %in% names(precios)) {
  precios <- subset(precios, !is.na(precio) & precio >= 0)
}

# 8. Convertir variables categóricas
for (v in c("region", "mercado", "producto", "variedad", "calidad", "origen", "mes")) {
  if (v %in% names(precios)) precios[[v]] <- factor(precios[[v]])
}

head(precios)
summary(precios)`,
  },
  {
    id: "precio-uva-vinificacion-2026",
    nombre: "Precio uva de vinificación 2026",
    area: "Agricultura",
    icono: "🍇",
    formato: "CSV",
    tamano: "Pequeña",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "Datos ODEPA",
    unidad: "Registro de precio",
    descripcion:
      "Precios de uva de vinificación por región, comuna, poder comprador, variedad, precio y grado brix.",
    contexto:
      "Esta base permite analizar precios pagados por uva de vinificación, considerando territorio, variedad y condiciones de compra. Es más específica que otras bases agrícolas, pero sirve para practicar análisis de precios y comparación entre grupos.",
    usos:
      "Puede utilizarse para tablas de frecuencia, boxplots por variedad o región, ANOVA y regresión lineal si se desea relacionar precio con grado brix u otra variable cuantitativa.",
    tecnicas: ["Tablas por variedad", "Boxplots", "ANOVA", "Regresión lineal"],
    preguntas: ["¿Existen diferencias de precio entre variedades?", "¿Qué regiones presentan mayores precios?", "¿Hay relación entre grado brix y precio?"],
    variables: ["fecha", "region", "comuna", "poder_comprador", "variedad", "precio", "grado_brix"],
    descarga: "/archivos/precio_uva_vinificacion_2026.csv",
    fuenteOriginal: "https://datos.odepa.gob.cl/dataset/precios-uva-vinificacion",
    script: `datos <- read.csv("precio_uva_vinificacion_2026.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Revisar estructura
names(datos)
head(datos)

# 2. Nombres en minúscula
names(datos) <- tolower(names(datos))

# 3. Seleccionar variables principales
vars <- c("fecha", "region", "comuna", "poder_comprador",
          "variedad", "precio", "grado_brix")
vars <- vars[vars %in% names(datos)]
uva <- datos[, vars]

# 4. Limpiar variables numéricas
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub("\\\\.", "", x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

if ("precio" %in% names(uva)) uva$precio <- limpiar_num(uva$precio)
if ("grado_brix" %in% names(uva)) uva$grado_brix <- limpiar_num(uva$grado_brix)

# 5. Crear fecha si existe
if ("fecha" %in% names(uva)) uva$fecha <- as.Date(uva$fecha)

# 6. Filtrar precio válido
if ("precio" %in% names(uva)) uva <- subset(uva, !is.na(precio) & precio >= 0)

# 8. Convertir variables categóricas
for (v in c("region", "comuna", "poder_comprador", "variedad")) {
  if (v %in% names(uva)) uva[[v]] <- factor(uva[[v]])
}

head(uva)
summary(uva)`,
  },
  {
    id: "temperaturas-diarias-estaciones-2012",
    nombre: "Temperaturas diarias por estaciones 2012",
    area: "Medio ambiente",
    icono: "🌡️",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Análisis temporal básico"],
    fuenteNombre: "Dirección Meteorológica de Chile / Datos.gob.cl",
    unidad: "Estación-día",
    descripcion:
      "Temperaturas mínimas y máximas diarias registradas por estaciones meteorológicas durante 2012.",
    contexto:
      "Esta base permite estudiar diferencias de temperatura entre estaciones meteorológicas y su evolución diaria. Es útil para introducir análisis temporal básico, comparación de grupos y construcción de variables como mes o estación del año.",
    usos:
      "Puede usarse para gráficos temporales, boxplots por mes o estación, ANOVA entre estaciones y análisis exploratorio de temperaturas máximas y mínimas.",
    tecnicas: ["Histogramas", "Boxplots por mes", "ANOVA", "Gráficos temporales"],
    preguntas: ["¿Qué estación tiene mayor temperatura promedio?", "¿Existen diferencias entre meses?", "¿Cómo se comportan las temperaturas máximas y mínimas?"],
    variables: ["codigo_estacion", "nombre_estacion", "anio", "mes", "dia", "fecha", "tmin", "tmax", "tmedia", "estacion_anio", "rango_termico"],
    descarga: "/archivos/temperaturasDiariasPorEstaciones2012.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("temperaturasDiariasPorEstaciones2012.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Revisar nombres originales
names(datos)

# 2. Pasar nombres a minúscula
names(datos) <- tolower(names(datos))

# 3. Seleccionar variables principales si existen
vars <- c("codigo_estacion", "estacion", "nombre_estacion", "anio", "año",
          "mes", "dia", "tmin", "tmax", "temperatura_minima", "temperatura_maxima")
vars <- vars[vars %in% names(datos)]
temp <- datos[, vars]

# 4. Función para limpiar números
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

# 5. Armonizar nombres si corresponde
if ("año" %in% names(temp)) names(temp)[names(temp) == "año"] <- "anio"
if ("temperatura_minima" %in% names(temp)) names(temp)[names(temp) == "temperatura_minima"] <- "tmin"
if ("temperatura_maxima" %in% names(temp)) names(temp)[names(temp) == "temperatura_maxima"] <- "tmax"

# 6. Convertir temperaturas
if ("tmin" %in% names(temp)) temp$tmin <- limpiar_num(temp$tmin)
if ("tmax" %in% names(temp)) temp$tmax <- limpiar_num(temp$tmax)

# 7. Crear fecha si existen año, mes y día
if (all(c("anio", "mes", "dia") %in% names(temp))) {
  temp$fecha <- as.Date(paste(temp$anio, temp$mes, temp$dia, sep = "-"))
}

# 8. Crear temperatura media y rango térmico
if (all(c("tmin", "tmax") %in% names(temp))) {
  temp$tmedia <- (temp$tmin + temp$tmax) / 2
  temp$rango_termico <- temp$tmax - temp$tmin
}

# 9. Filtrar temperaturas válidas
if (all(c("tmin", "tmax") %in% names(temp))) {
  temp <- subset(temp, !is.na(tmin) & !is.na(tmax))
}

# 10. Convertir variables categóricas
for (v in c("codigo_estacion", "estacion", "nombre_estacion", "mes")) {
  if (v %in% names(temp)) temp[[v]] <- factor(temp[[v]])
}

head(temp)
summary(temp)`,
  },
  {
    id: "emisiones-transporte-2024",
    nombre: "Emisiones de transporte 2024",
    area: "Medio ambiente",
    icono: "🚗",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "MMA / Datos.gob.cl",
    unidad: "Registro de emisión",
    descripcion:
      "Emisiones del transporte por comuna, ciudad, contaminante, tipo de vehículo, tipo de emisión y toneladas emitidas.",
    contexto:
      "Esta base permite estudiar emisiones asociadas al transporte, diferenciando por tipo de vehículo, contaminante y territorio. Es útil para comparar comunas o ciudades, identificar contaminantes principales y trabajar análisis exploratorio ambiental.",
    usos:
      "Puede utilizarse para tablas de frecuencia, gráficos de barras, boxplots por tipo de vehículo, ANOVA y regresión lineal si se estudian toneladas emitidas.",
    tecnicas: ["Tablas por contaminante", "Boxplots por vehículo", "ANOVA", "Regresión lineal"],
    preguntas: ["¿Qué contaminantes concentran más emisiones?", "¿Qué tipos de vehículo emiten más toneladas?", "¿Existen diferencias entre ciudades o comunas?"],
    variables: ["region", "comuna", "ciudad", "tipo_vehiculo", "contaminante", "tipo_emision", "toneladas"],
    descarga: "/archivos/ruea-tr-2024-ckan_mejora.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("ruea-tr-2024-ckan_mejora.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Revisar nombres
names(datos)

# 2. Pasar nombres a minúscula
names(datos) <- tolower(names(datos))

# 3. Seleccionar variables principales según estén disponibles
vars <- c("region", "comuna", "ciudad", "tipo_vehiculo",
          "contaminante", "tipo_emision", "toneladas")
vars <- vars[vars %in% names(datos)]
emisiones <- datos[, vars]

# 4. Limpiar toneladas
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

if ("toneladas" %in% names(emisiones)) {
  emisiones$toneladas <- limpiar_num(emisiones$toneladas)
  emisiones <- subset(emisiones, !is.na(toneladas) & toneladas >= 0)
}

# 5. Convertir variables categóricas
for (v in c("region", "comuna", "ciudad", "tipo_vehiculo", "contaminante", "tipo_emision")) {
  if (v %in% names(emisiones)) emisiones[[v]] <- factor(emisiones[[v]])
}

head(emisiones)
summary(emisiones)`,
  },
  {
    id: "precipitacion-estaciones",
    nombre: "Precipitación diaria por estaciones",
    area: "Medio ambiente",
    icono: "🌧️",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Análisis temporal básico"],
    fuenteNombre: "Dirección Meteorológica de Chile / Datos.gob.cl",
    unidad: "Estación-día",
    descripcion:
      "Registros diarios de precipitación por estación meteorológica, con año, mes, día y monto de precipitación.",
    contexto:
      "Esta base permite estudiar la precipitación diaria registrada en distintas estaciones meteorológicas. Es útil para comparar estaciones, meses o años, construir indicadores de lluvia acumulada y realizar análisis temporal básico sin necesidad de usar modelos avanzados de series de tiempo.",
    usos:
      "Puede utilizarse para histogramas, acumulados mensuales, boxplots por mes, ANOVA entre estaciones y regresión lineal simple para estudiar cambios en el tiempo.",
    tecnicas: ["Acumulados por mes", "Boxplots", "ANOVA", "Regresión lineal", "Gráficos temporales"],
    preguntas: ["¿Qué estaciones registran mayor precipitación?", "¿Existen diferencias entre meses?", "¿Cómo cambia la precipitación diaria durante el año?"],
    variables: ["codigo_estacion", "estacion", "latitud", "altura", "anio", "mes", "dia", "precipitacion", "fecha"],
    descarga: "/archivos/Precipitacion.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("Precipitacion.csv",
                  sep = ";",
                  header = FALSE,
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Asignar nombres, porque la base viene sin encabezado formal
names(datos) <- c("codigo_estacion", "estacion", "latitud", "altura",
                  "anio", "mes", "dia", "precipitacion")

# 2. Limpiar código de estación
datos$codigo_estacion <- gsub("[^0-9]", "", as.character(datos$codigo_estacion))

# 3. Convertir variables numéricas
datos$anio <- as.numeric(datos$anio)
datos$mes <- as.numeric(datos$mes)
datos$dia <- as.numeric(datos$dia)
datos$altura <- as.numeric(datos$altura)
datos$precipitacion <- as.numeric(gsub(",", ".", datos$precipitacion))

# 4. Crear fecha
datos$fecha <- as.Date(paste(datos$anio, datos$mes, datos$dia, sep = "-"))

# 5. Filtrar datos válidos
precipitacion <- subset(datos,
                        !is.na(fecha) &
                        !is.na(precipitacion) &
                        precipitacion >= 0)

# 6. Crear variables categóricas
precipitacion$estacion <- factor(precipitacion$estacion)
precipitacion$mes_factor <- factor(precipitacion$mes,
                                   levels = 1:12,
                                   labels = c("Ene","Feb","Mar","Abr","May","Jun",
                                              "Jul","Ago","Sep","Oct","Nov","Dic"))

head(precipitacion)
summary(precipitacion)`,
  },
  {
    id: "poblacion-genero-region-edad",
    nombre: "Población por sexo, región y edad",
    area: "Demografía",
    icono: "👥",
    formato: "XLSX",
    tamano: "Pequeña",
    analisis: ["Exploratorio", "Regresión lineal", "Comparación de grupos"],
    fuenteNombre: "INE",
    unidad: "Serie demográfica anual",
    descripcion:
      "Estimaciones de población por sexo, edad y región, en formato anual.",
    contexto:
      "Esta base permite estudiar cambios en la estructura poblacional por sexo, edad y región. Es útil para introducir análisis demográfico, crecimiento poblacional y comparación de grupos etarios en el tiempo.",
    usos:
      "Puede utilizarse para análisis exploratorio, gráficos de evolución anual, comparación por sexo o edad y regresión lineal simple sobre tendencias poblacionales.",
    tecnicas: ["Gráficos de líneas", "Tablas por año", "Regresión lineal", "Comparación de grupos"],
    preguntas: ["¿Cómo ha cambiado la población total?", "¿Qué grupo etario crece más rápido?", "¿Existen diferencias entre hombres y mujeres?"],
    variables: ["region", "serie", "anio", "poblacion", "sexo", "grupo_edad"],
    descarga: "/archivos/EST_GEN_POB_16.xlsx",
    fuenteOriginal: "https://www.ine.gob.cl",
    script: `library(readxl)
library(dplyr)
library(tidyr)

datos <- read_excel("EST_GEN_POB_16.xlsx", skip = 2)

# 1. Revisar nombres
names(datos)
head(datos)

# 2. Renombrar primeras columnas
names(datos)[1] <- "region"
names(datos)[2] <- "serie"

# 3. Pasar de formato ancho a formato largo
poblacion <- datos %>%
  pivot_longer(
    cols = -c(region, serie),
    names_to = "anio",
    values_to = "poblacion"
  )

# 4. Limpiar variables
poblacion$region <- trimws(as.character(poblacion$region))
poblacion$serie <- trimws(as.character(poblacion$serie))
poblacion$anio <- as.numeric(gsub("[^0-9]", "", as.character(poblacion$anio)))
poblacion$poblacion <- as.numeric(poblacion$poblacion)

# 5. Filtrar filas válidas
poblacion <- subset(poblacion,
                    !is.na(region) &
                    !is.na(serie) &
                    !is.na(anio) &
                    !is.na(poblacion))

# 6. Crear variables auxiliares desde el texto de la serie
poblacion$sexo <- ifelse(grepl("mujer", tolower(poblacion$serie)), "Mujeres",
                  ifelse(grepl("hombre", tolower(poblacion$serie)), "Hombres", "Total"))
poblacion$grupo_edad <- ifelse(grepl("0-14", poblacion$serie), "0-14",
                        ifelse(grepl("15-64", poblacion$serie), "15-64",
                        ifelse(grepl("65", poblacion$serie), "65 y más", "Total")))

poblacion$region <- factor(poblacion$region)
poblacion$sexo <- factor(poblacion$sexo)
poblacion$grupo_edad <- factor(poblacion$grupo_edad)

head(poblacion)
summary(poblacion)`,
  },
  {
    id: "serie-nacimientos-2020-2022",
    nombre: "Serie de nacimientos 2020-2022",
    area: "Demografía",
    icono: "👶",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión logística", "Comparación de proporciones"],
    fuenteNombre: "DEIS / MINSAL",
    unidad: "Nacimiento",
    descripcion:
      "Registros de nacimientos con variables de año, mes, sexo, tipo de parto, semanas de gestación, peso, características de madre y región de residencia.",
    contexto:
      "Esta base permite estudiar nacimientos en Chile durante 2020 a 2022. Incluye características del nacimiento, del parto y de la madre, por lo que permite formular preguntas demográficas y de salud pública.",
    usos:
      "Puede utilizarse para tablas de frecuencia, comparación por región, análisis de nacimientos por año o mes, ANOVA para semanas de gestación y regresión logística para variables binarias como tipo de parto.",
    tecnicas: ["Tablas de frecuencia", "Gráficos por mes", "ANOVA", "Regresión logística", "Comparación de proporciones"],
    preguntas: ["¿Existen diferencias de nacimientos por región?", "¿Cambió la cantidad de nacimientos entre 2020 y 2022?", "¿El tipo de parto se relaciona con semanas de gestación?"],
    variables: ["MES_NAC", "ANO_NAC", "SEXO", "TIPO_PARTO", "TIPO_ATEN", "SEMANAS", "RANGO_PESO", "GRUPO_ETARIO_MADRE", "NIVEL_MADRE", "REGION_RESIDENCIA", "GLOSA_REGION_RESIDENCIA"],
    descarga: "/archivos/Serie_Nacimientos_2020_2022.csv",
    fuenteOriginal: "https://deis.minsal.cl/#datos-abiertos",
    script: `datos <- read.csv("Serie_Nacimientos_2020_2022.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
nac <- datos[, c(
  "MES_NAC",
  "ANO_NAC",
  "SEXO",
  "TIPO_PARTO",
  "TIPO_ATEN",
  "SEMANAS",
  "RANGO_PESO",
  "GRUPO_ETARIO_MADRE",
  "NIVEL_MADRE",
  "REGION_RESIDENCIA",
  "GLOSA_REGION_RESIDENCIA"
)]

# 2. Filtrar registros con información básica
nac <- subset(nac,
              !is.na(MES_NAC) &
              !is.na(ANO_NAC) &
              !is.na(SEXO) &
              !is.na(TIPO_PARTO) &
              !is.na(SEMANAS) &
              !is.na(REGION_RESIDENCIA))

# 3. Filtrar semanas de gestación coherentes
nac <- subset(nac, SEMANAS >= 20 & SEMANAS <= 45)

# 4. Crear fecha aproximada de mes de nacimiento
nac$fecha_mes <- as.Date(paste(nac$ANO_NAC, nac$MES_NAC, "01", sep = "-"))

# 5. Convertir variables categóricas
nac$SEXO <- factor(nac$SEXO)
nac$TIPO_PARTO <- factor(nac$TIPO_PARTO)
nac$TIPO_ATEN <- factor(nac$TIPO_ATEN)
nac$RANGO_PESO <- factor(nac$RANGO_PESO)
nac$GRUPO_ETARIO_MADRE <- factor(nac$GRUPO_ETARIO_MADRE)
nac$NIVEL_MADRE <- factor(nac$NIVEL_MADRE)
nac$REGION_RESIDENCIA <- factor(nac$REGION_RESIDENCIA)

head(nac)
summary(nac)`,
  },
  {
    id: "registro-sanciones-casinos",
    nombre: "Registro de sanciones a casinos",
    area: "Seguridad",
    icono: "⚖️",
    formato: "CSV",
    tamano: "Pequeña",
    analisis: ["Exploratorio", "Tablas de frecuencia", "Regresión logística"],
    fuenteNombre: "Superintendencia de Casinos de Juego",
    unidad: "Sanción",
    descripcion:
      "Registro de sanciones aplicadas a sociedades operadoras de casinos, incluyendo casino, fecha, monto en UTM, descripción y estado.",
    contexto:
      "Esta base permite trabajar con sanciones administrativas en el sector de casinos de juego. Es útil para análisis descriptivo, extracción de montos desde texto y comparación de sanciones por casino o estado de pago.",
    usos:
      "Puede utilizarse para limpieza de texto, tablas de frecuencia, análisis descriptivo de montos y regresión logística si se define una variable binaria como sanción pagada o no pagada.",
    tecnicas: ["Limpieza de texto", "Tablas de frecuencia", "Gráficos de barras", "Regresión logística"],
    preguntas: ["¿Qué casinos concentran más sanciones?", "¿Cuál es el monto promedio de sanción?", "¿Qué proporción de sanciones aparece como pagada?"],
    variables: ["sociedad_operadora", "casino", "resolucion", "fecha", "monto_utm", "descripcion", "estado"],
    descarga: "/archivos/RegistroSanciones.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("RegistroSanciones.csv",
                  sep = ";",
                  skip = 3,
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Renombrar variables
names(datos) <- c("sociedad_operadora", "casino", "resolucion",
                  "fecha", "monto_sancion", "descripcion", "estado")

# 2. Eliminar filas completamente vacías
datos <- datos[rowSums(is.na(datos) | datos == "") < ncol(datos), ]

# 3. Crear fecha
datos$fecha <- as.Date(datos$fecha, format = "%d-%m-%Y")
datos$anio <- format(datos$fecha, "%Y")

# 4. Extraer primer número del monto en UTM
extraer_monto <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  monto <- regmatches(x, regexpr("[0-9]+(\\\\.[0-9]+)?", x))
  as.numeric(monto)
}

datos$monto_utm <- extraer_monto(datos$monto_sancion)

# 5. Crear variable binaria pagada / no pagada
datos$pagada <- ifelse(grepl("pagada", tolower(datos$estado)), 1, 0)

# 6. Filtrar registros válidos
sanciones <- subset(datos,
                    !is.na(casino) &
                    !is.na(fecha) &
                    !is.na(monto_utm))

# 7. Convertir categóricas
sanciones$casino <- factor(sanciones$casino)
sanciones$estado <- factor(sanciones$estado)
sanciones$anio <- factor(sanciones$anio)

head(sanciones)
summary(sanciones)`,
  },
  {
    id: "empleos-turisticos-rm",
    nombre: "Empleos turísticos RM",
    area: "Turismo",
    icono: "🧳",
    formato: "CSV",
    tamano: "Grande",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "SERNATUR / Datos.gob.cl",
    unidad: "Empresa / establecimiento turístico",
    descripcion:
      "Base de empleos turísticos en la Región Metropolitana, con actividad, empleo, ventas y variables asociadas a establecimientos turísticos.",
    contexto:
      "Esta base permite estudiar empleo en actividades turísticas de la Región Metropolitana. Tiene muchas variables, por lo que se recomienda seleccionar un subconjunto simple relacionado con actividad económica, empleo y ventas antes de comenzar el análisis.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de empleo por actividad, ANOVA y regresión lineal si se trabaja con variables de empleo o ventas.",
    tecnicas: ["Tablas por actividad", "Boxplots", "ANOVA", "Regresión lineal"],
    preguntas: ["¿Qué actividades turísticas concentran más empleo?", "¿Existen diferencias de empleo entre actividades?", "¿Existe relación entre ventas y número de trabajadores?"],
    variables: ["Id_Encuesta", "Actividad", "Reg", "Act_Cod", "B7", "F1t", "F2t", "G1", "Fexp"],
    descarga: "/archivos/empleos_turisticos_region_metropolitana.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("empleos_turisticos_region_metropolitana.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales que permiten partir el análisis
# Se mantienen variables generales y algunas columnas de empleo/ventas si existen.
vars <- c("Id_Encuesta", "Actividad", "Reg", "Act_Cod", "B7", "F1t", "F2t", "G1", "Fexp")
vars <- vars[vars %in% names(datos)]
turismo <- datos[, vars]

# 2. Función para limpiar números
limpiar_num <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

# 3. Convertir variables numéricas disponibles
for (v in c("B7", "F1t", "F2t", "G1", "Fexp")) {
  if (v %in% names(turismo)) turismo[[v]] <- limpiar_num(turismo[[v]])
}

# 4. Filtrar registros con actividad
if ("Actividad" %in% names(turismo)) {
  turismo <- subset(turismo, !is.na(Actividad) & Actividad != "")
  turismo$Actividad <- factor(turismo$Actividad)
}

# 5. Convertir región y código de actividad
if ("Reg" %in% names(turismo)) turismo$Reg <- factor(turismo$Reg)
if ("Act_Cod" %in% names(turismo)) turismo$Act_Cod <- factor(turismo$Act_Cod)

head(turismo)
summary(turismo)`,
  },
  {
    id: "emergencias-agricolas",
    nombre: "Emergencias agrícolas",
    area: "Agricultura",
    icono: "🌾",
    formato: "CSV",
    tamano: "Pequeña",
    analisis: ["Exploratorio", "ANOVA", "Regresión logística"],
    fuenteNombre: "Subsecretaría de Agricultura",
    unidad: "Emergencia comunal",
    descripcion:
      "Registros de emergencias agrícolas por región, provincia, comuna, fecha y situación declarada.",
    contexto:
      "Esta base permite estudiar emergencias agrícolas asociadas a eventos como déficit hídrico o sequía. Es útil para contar eventos por territorio, comparar regiones y crear variables temporales para observar patrones por año o mes.",
    usos:
      "Puede utilizarse para análisis exploratorio, tablas por región, gráficos de barras, comparación entre tipos de emergencia y modelos logísticos simples si se define una situación de interés.",
    tecnicas: ["Tablas de frecuencia", "Gráficos de barras", "ANOVA sobre conteos agregados", "Regresión logística"],
    preguntas: ["¿Qué regiones concentran más emergencias agrícolas?", "¿Qué tipo de situación aparece con mayor frecuencia?", "¿Cómo se distribuyen las emergencias por año?"],
    variables: ["Region", "Provincia", "Comuna", "Fecha", "Sit", "anio", "mes"],
    descarga: "/archivos/Emergencias Agrícolas Subsecretaría de Agricultura.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("Emergencias Agrícolas Subsecretaría de Agricultura.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
emergencias <- datos[, c("Region", "Provincia", "Comuna", "Fecha", "Sit")]

# 2. Crear fecha
emergencias$Fecha <- as.Date(emergencias$Fecha, format = "%d-%m-%Y")

# 3. Filtrar registros válidos
emergencias <- subset(emergencias,
                      !is.na(Region) &
                      !is.na(Provincia) &
                      !is.na(Comuna) &
                      !is.na(Fecha) &
                      !is.na(Sit))

# 4. Crear año y mes
emergencias$anio <- format(emergencias$Fecha, "%Y")
emergencias$mes <- format(emergencias$Fecha, "%m")

# 5. Convertir categóricas
emergencias$Region <- factor(emergencias$Region)
emergencias$Provincia <- factor(emergencias$Provincia)
emergencias$Comuna <- factor(emergencias$Comuna)
emergencias$Sit <- factor(emergencias$Sit)
emergencias$anio <- factor(emergencias$anio)
emergencias$mes <- factor(emergencias$mes)

head(emergencias)
summary(emergencias)`,
  },
  {
    id: "empleo-plantas-proceso-pesca-2005",
    nombre: "Empleo en plantas de proceso pesquero 2005",
    area: "Pesca e industria",
    icono: "🐟",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Regresión logística", "Comparación de proporciones"],
    fuenteNombre: "Subsecretaría de Pesca y Acuicultura / IFOP",
    unidad: "Registro de empleo",
    descripcion:
      "Censo de empleo en plantas de proceso pesquero, con información de región, trimestre, mes, categoría, función, género, ocupados y clase de industria.",
    contexto:
      "Esta base recoge información de empleo en plantas de proceso del sector pesquero durante 2005. Permite estudiar distribución territorial del empleo, diferencias por género, categorías laborales y tipo de industria. Aunque es una base antigua, es útil para practicar análisis exploratorio y comparaciones entre grupos con datos reales chilenos.",
    usos:
      "Puede utilizarse para tablas de frecuencia, comparación de ocupados por región, ANOVA sobre número de ocupados y regresión logística si se define una variable binaria asociada a género o tipo de contrato.",
    tecnicas: ["Tablas de frecuencia", "Gráficos de barras", "ANOVA", "Comparación de proporciones", "Regresión logística"],
    preguntas: ["¿Qué regiones concentran más empleo en plantas de proceso?", "¿Hay diferencias de género en ocupaciones?", "¿El número de ocupados cambia según categoría o función?"],
    variables: ["AÑO", "NUI", "Región", "Trimestre", "Mes", "Categoría", "Función", "Género", "Ocupados", "CLASE_INDUSTRIA_II"],
    descarga: "/archivos/empleoPlantasDeProceso2005.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("empleoPlantasDeProceso2005.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

# 1. Seleccionar variables principales
empleo_pesca <- datos[, c(
  "AÑO",
  "NUI",
  "Región",
  "Trimestre",
  "Mes",
  "Categoría",
  "Función",
  "Género",
  "Ocupados",
  "CLASE_INDUSTRIA_II"
)]

# 2. Renombrar para evitar tildes en el trabajo posterior
names(empleo_pesca) <- c("anio", "nui", "region", "trimestre", "mes",
                         "categoria", "funcion", "genero", "ocupados",
                         "clase_industria")

# 3. Convertir ocupados a numérico
empleo_pesca$ocupados <- as.numeric(empleo_pesca$ocupados)

# 4. Filtrar registros válidos
empleo_pesca <- subset(empleo_pesca,
                       !is.na(region) &
                       !is.na(categoria) &
                       !is.na(funcion) &
                       !is.na(genero) &
                       !is.na(ocupados) &
                       ocupados >= 0)

# 5. Convertir variables categóricas
empleo_pesca$region <- factor(empleo_pesca$region)
empleo_pesca$trimestre <- factor(empleo_pesca$trimestre)
empleo_pesca$mes <- factor(empleo_pesca$mes)
empleo_pesca$categoria <- factor(empleo_pesca$categoria)
empleo_pesca$funcion <- factor(empleo_pesca$funcion)
empleo_pesca$genero <- factor(empleo_pesca$genero)
empleo_pesca$clase_industria <- factor(empleo_pesca$clase_industria)

head(empleo_pesca)
summary(empleo_pesca)`,
  },

  {
    id: "cep-91-2024",
    nombre: "Encuesta CEP 91 - 2024",
    area: "Opinión pública",
    icono: "🗳️",
    formato: "CSV",
    tamano: "Mediana",
    variables: "Variables políticas, opinión pública y sociodemográficas",
    fuente: "CEP Chile",
    fuenteNombre: "Centro de Estudios Públicos",
    descarga: "/archivos/base_91.csv",
    fuenteOriginal: "https://www.cepchile.cl/opinion-publica/encuesta-cep/",
    analisis: ["Exploratorio", "Tablas cruzadas", "Regresión logística"],
    descripcion: "Encuesta de opinión pública aplicada en junio-julio de 2024, útil para estudiar percepción política, evaluación institucional, temas públicos y características sociodemográficas.",
    contexto: "Esta base es especialmente útil para estudiantes de ciencia política porque permite trabajar con datos de opinión pública reales. Se puede analizar cómo varían las opiniones según edad, sexo, educación, zona, posición política u otras variables disponibles en la encuesta. Como es una encuesta, antes de analizar se debe revisar el cuestionario y el diccionario para entender qué significa cada código de respuesta.",
    usos: "Permite practicar lectura de encuestas, recodificación de respuestas, tablas de frecuencia, cruces entre variables, gráficos de barras y modelos simples para respuestas binarias u ordinales.",
    tecnicas: "Análisis exploratorio, tablas de contingencia, gráficos de barras, comparación de proporciones, chi-cuadrado y regresión logística si se construye una variable respuesta binaria.",
    preguntas: [
      "¿Cómo se distribuye la confianza en instituciones en la medición 2024?",
      "¿Existen diferencias de opinión política según edad, sexo o nivel educacional?",
      "¿Qué características se asocian con una mayor aprobación o desaprobación de ciertas instituciones?"
    ],
    sugerenciasFiltros: [
      "Revisar primero el cuestionario para identificar las variables de opinión que se usarán.",
      "Seleccionar solo variables sociodemográficas y una pregunta de opinión principal.",
      "Recodificar respuestas como No sabe / No contesta a NA antes del análisis."
    ],
    script: `# ============================================================
# DATASET: Encuesta CEP 91, junio-julio 2024
# Objetivo: preparar una base simple para análisis de opinión pública
# ============================================================

# 1. Cargar la base
# El archivo debe estar en la misma carpeta de trabajo de R
datos_cep91 <- read.csv("base_91.csv",
                        stringsAsFactors = FALSE)

# 2. Revisar estructura general
dim(datos_cep91)
names(datos_cep91)
head(datos_cep91)

# 3. Seleccionar variables principales
# Estas variables permiten trabajar temas de ciencia política:
# - sexo, edad, región, zona, grupo socioeconómico
# - aprobación del gobierno
# - principal problema del país
# - confianza institucional
# - posición ideológica

variables_cep91 <- c(
  "sexo",
  "edad",
  "region_3",
  "zona_u_r",
  "gse",
  "pond",
  "estrato",
  "secu",
  "eval_gob_1",
  "percepcion_1_a",
  "confianza_6_a",
  "confianza_6_b",
  "confianza_6_j",
  "iden_pol_2"
)

variables_cep91 <- variables_cep91[variables_cep91 %in% names(datos_cep91)]

cep91 <- datos_cep91[, variables_cep91]

# 4. Renombrar región para dejar un nombre más simple
names(cep91)[names(cep91) == "region_3"] <- "region"

# 5. Reemplazar códigos especiales por NA
# En encuestas es común que valores como 88, 99, -8 o -9 representen
# "No sabe", "No responde" u otros casos no válidos para análisis directo.

codigos_invalidos <- c(88, 99, -8, -9, -88, -99)

for (v in names(cep91)) {
  if (is.numeric(cep91[[v]]) || is.integer(cep91[[v]])) {
    cep91[[v]][cep91[[v]] %in% codigos_invalidos] <- NA
  }
}

# 6. Crear variables más fáciles de interpretar

# Variable binaria: aprobación del gobierno
# Según el diccionario:
# 1 = Aprueba
# 2 = Desaprueba

cep91$aprueba_gobierno <- ifelse(cep91$eval_gob_1 == 1, 1,
                                 ifelse(cep91$eval_gob_1 == 2, 0, NA))

# Variable de posición ideológica
# Escala de 1 a 10, donde 1 = izquierda y 10 = derecha
cep91$posicion_ideologica <- ifelse(cep91$iden_pol_2 %in% 1:10,
                                    cep91$iden_pol_2,
                                    NA)

# Grupos de edad
cep91$grupo_edad <- cut(cep91$edad,
                        breaks = c(17, 29, 44, 59, 120),
                        labels = c("18-29", "30-44", "45-59", "60 o más"),
                        right = TRUE)

# 7. Convertir variables categóricas a factor

cep91$sexo <- factor(cep91$sexo,
                     levels = c(1, 2),
                     labels = c("Hombre", "Mujer"))

cep91$zona_u_r <- factor(cep91$zona_u_r,
                         levels = c(1, 2),
                         labels = c("Urbana", "Rural"))

cep91$aprueba_gobierno <- factor(cep91$aprueba_gobierno,
                                 levels = c(0, 1),
                                 labels = c("Desaprueba", "Aprueba"))

cep91$region <- factor(cep91$region)
cep91$gse <- factor(cep91$gse)

# 8. Filtrar observaciones mínimas para análisis
# Se conserva a quienes tienen información básica y ponderador.

cep91_limpia <- subset(cep91,
                       !is.na(sexo) &
                         !is.na(edad) &
                         !is.na(region) &
                         !is.na(zona_u_r) &
                         !is.na(pond))

# 9. Revisar base limpia

dim(cep91_limpia)
head(cep91_limpia)
summary(cep91_limpia)
colSums(is.na(cep91_limpia))

# 10. Ejemplos iniciales de análisis exploratorio

# Distribución simple de aprobación
table(cep91_limpia$aprueba_gobierno, useNA = "ifany")

# Proporción simple
prop.table(table(cep91_limpia$aprueba_gobierno))

# Proporción ponderada usando el ponderador de la encuesta
aprobacion_ponderada <- xtabs(pond ~ aprueba_gobierno,
                              data = cep91_limpia)

prop.table(aprobacion_ponderada)

# Aprobación por sexo
tabla_sexo <- xtabs(pond ~ sexo + aprueba_gobierno,
                    data = cep91_limpia)

prop.table(tabla_sexo, margin = 1)

# Aprobación por grupo de edad
tabla_edad <- xtabs(pond ~ grupo_edad + aprueba_gobierno,
                    data = cep91_limpia)

prop.table(tabla_edad, margin = 1)

# 11. Base final para iniciar análisis exploratorio
datos_final_cep91 <- cep91_limpia`
  },
  {
    id: "cep-89-91-comparacion",
    nombre: "Encuesta CEP 2023-2024 comparada",
    area: "Opinión pública",
    icono: "📊",
    formato: "CSV",
    tamano: "Mediana",
    variables: "Variables comunes entre CEP 89 y CEP 91",
    fuente: "CEP Chile",
    fuenteNombre: "Centro de Estudios Públicos",
    descargas: ["/archivos/base_89.csv", "/archivos/base_91.csv"],
    fuenteOriginal: "https://www.cepchile.cl/opinion-publica/encuesta-cep/",
    analisis: ["Exploratorio", "Comparación temporal", "Tablas cruzadas"],
    descripcion: "Comparación entre dos mediciones de la Encuesta CEP: junio-julio 2023 y junio-julio 2024. Sirve para observar cambios en opiniones, percepciones o evaluaciones entre años.",
    contexto: "Esta ficha es más avanzada que usar una sola encuesta porque requiere comparar dos bases que no necesariamente tienen exactamente las mismas variables. El paso central es identificar variables comunes y revisar en el cuestionario si las preguntas mantienen el mismo significado entre 2023 y 2024.",
    usos: "Permite analizar cambios descriptivos en el tiempo, comparar porcentajes entre mediciones y construir gráficos simples por año sin entrar en series de tiempo.",
    tecnicas: "Análisis exploratorio, tablas porcentuales por año, gráficos de barras comparados, comparación de proporciones y chi-cuadrado si corresponde.",
    preguntas: [
      "¿Cambió la distribución de una opinión política entre 2023 y 2024?",
      "¿Qué variables sociodemográficas se mantienen comparables entre ambas mediciones?",
      "¿Los cambios observados son similares para distintos grupos de edad o educación?"
    ],
    sugerenciasFiltros: [
      "Usar solo variables presentes en ambas bases.",
      "Confirmar en los cuestionarios que la pregunta tenga el mismo sentido en ambos años.",
      "Crear una variable año para distinguir 2023 y 2024 antes de unir las bases."
    ],
    script: `# ============================================================
# DATASET: Encuesta CEP 89 vs CEP 91
# Objetivo: comparar opinión pública entre 2023 y 2024
# ============================================================

# 1. Cargar bases
# Los archivos deben estar en la misma carpeta de trabajo

cep89_original <- read.csv("base_89.csv",
                           stringsAsFactors = FALSE)

cep91_original <- read.csv("base_91.csv",
                           stringsAsFactors = FALSE)

# 2. Revisar estructura general

dim(cep89_original)
dim(cep91_original)

names(cep89_original)
names(cep91_original)

# 3. Seleccionar variables comparables

# En CEP 89 la región aparece como "region"
# En CEP 91 la región aparece como "region_3"
# Por eso se corrige el nombre antes de juntar.

variables_cep89 <- c(
  "sexo",
  "edad",
  "region",
  "zona_u_r",
  "gse",
  "pond",
  "estrato",
  "secu",
  "eval_gob_1",
  "percepcion_1_a",
  "confianza_6_a",
  "iden_pol_2"
)

variables_cep91 <- c(
  "sexo",
  "edad",
  "region_3",
  "zona_u_r",
  "gse",
  "pond",
  "estrato",
  "secu",
  "eval_gob_1",
  "percepcion_1_a",
  "confianza_6_a",
  "iden_pol_2"
)

variables_cep89 <- variables_cep89[variables_cep89 %in% names(cep89_original)]
variables_cep91 <- variables_cep91[variables_cep91 %in% names(cep91_original)]

cep89 <- cep89_original[, variables_cep89]
cep91 <- cep91_original[, variables_cep91]

# 4. Homologar nombre de región

names(cep91)[names(cep91) == "region_3"] <- "region"

# 5. Agregar variable año

cep89$anio <- 2023
cep91$anio <- 2024

# 6. Reemplazar códigos especiales por NA

limpiar_codigos <- function(base) {
  codigos_invalidos <- c(88, 99, -8, -9, -88, -99)
  
  for (v in names(base)) {
    if (is.numeric(base[[v]]) || is.integer(base[[v]])) {
      base[[v]][base[[v]] %in% codigos_invalidos] <- NA
    }
  }
  
  return(base)
}

cep89 <- limpiar_codigos(cep89)
cep91 <- limpiar_codigos(cep91)

# 7. Juntar bases

cep_comparada <- rbind(cep89, cep91)

# 8. Crear variables interpretables

cep_comparada$aprueba_gobierno <- ifelse(cep_comparada$eval_gob_1 == 1, 1,
                                         ifelse(cep_comparada$eval_gob_1 == 2, 0, NA))

cep_comparada$posicion_ideologica <- ifelse(cep_comparada$iden_pol_2 %in% 1:10,
                                            cep_comparada$iden_pol_2,
                                            NA)

cep_comparada$grupo_edad <- cut(cep_comparada$edad,
                                breaks = c(17, 29, 44, 59, 120),
                                labels = c("18-29", "30-44", "45-59", "60 o más"),
                                right = TRUE)

# 9. Convertir variables categóricas a factor

cep_comparada$anio <- factor(cep_comparada$anio)

cep_comparada$sexo <- factor(cep_comparada$sexo,
                             levels = c(1, 2),
                             labels = c("Hombre", "Mujer"))

cep_comparada$zona_u_r <- factor(cep_comparada$zona_u_r,
                                 levels = c(1, 2),
                                 labels = c("Urbana", "Rural"))

cep_comparada$aprueba_gobierno <- factor(cep_comparada$aprueba_gobierno,
                                         levels = c(0, 1),
                                         labels = c("Desaprueba", "Aprueba"))

cep_comparada$region <- factor(cep_comparada$region)
cep_comparada$gse <- factor(cep_comparada$gse)

# 10. Filtrar observaciones mínimas

cep_comparada_limpia <- subset(cep_comparada,
                               !is.na(anio) &
                                 !is.na(sexo) &
                                 !is.na(edad) &
                                 !is.na(region) &
                                 !is.na(pond))

# 11. Revisión final

dim(cep_comparada_limpia)
head(cep_comparada_limpia)
summary(cep_comparada_limpia)
colSums(is.na(cep_comparada_limpia))

# 12. Ejemplos iniciales de comparación

# Distribución simple por año
table(cep_comparada_limpia$anio)

# Aprobación por año, usando ponderador
tabla_aprobacion_anio <- xtabs(pond ~ anio + aprueba_gobierno,
                               data = cep_comparada_limpia)

tabla_aprobacion_anio

prop.table(tabla_aprobacion_anio, margin = 1)

# Posición ideológica promedio por año
aggregate(posicion_ideologica ~ anio,
          data = cep_comparada_limpia,
          mean,
          na.rm = TRUE)

# Aprobación por año y sexo
tabla_anio_sexo <- xtabs(pond ~ anio + sexo + aprueba_gobierno,
                         data = cep_comparada_limpia)

prop.table(tabla_anio_sexo, margin = c(1, 2))

# 13. Base final para iniciar análisis exploratorio
datos_final_cep_comparada <- cep_comparada_limpia`
  },
];

const areas = [
  { nombre: "Educación", icono: "🎓", descripcion: "Bases para rendimiento académico y contexto escolar.", color: "#1d4ed8" },
  { nombre: "Datos sociales", icono: "📊", descripcion: "Bases para ingreso, pobreza, escolaridad, salud y desigualdad.", color: "#047857" },
  { nombre: "Opinión pública", icono: "🏛️", descripcion: "Encuestas de opinión, percepciones políticas, confianza institucional y comparación entre mediciones.", color: "#4338ca" },
  { nombre: "Vivienda", icono: "🏠", descripcion: "Bases para condiciones habitacionales, hacinamiento, tenencia y territorio.", color: "#92400e" },
  { nombre: "Salud", icono: "🏥", descripcion: "Bases para egresos hospitalarios, mortalidad e indicadores de salud.", color: "#be123c" },
  { nombre: "Trabajo", icono: "💼", descripcion: "Bases para ocupación, desocupación, informalidad y condiciones laborales.", color: "#7c3aed" },
  { nombre: "Economía", icono: "💰", descripcion: "Bases para PIB regional, actividad económica e indicadores macroeconómicos.", color: "#b45309" },
  { nombre: "Medio ambiente", icono: "🌱", descripcion: "Bases para calidad del aire, clima, contaminación y análisis ambiental.", color: "#15803d" },
  { nombre: "Agricultura", icono: "🌾", descripcion: "Bases para precios agrícolas, emergencias y actividad agropecuaria.", color: "#65a30d" },
  { nombre: "Demografía", icono: "👥", descripcion: "Bases para población, nacimientos y estructura demográfica.", color: "#0891b2" },
  { nombre: "Seguridad", icono: "⚖️", descripcion: "Bases para sanciones, registros administrativos y análisis legal.", color: "#475569" },
  { nombre: "Turismo", icono: "🧳", descripcion: "Bases para empleo turístico y actividad económica asociada.", color: "#db2777" },
  { nombre: "Pesca e industria", icono: "🐟", descripcion: "Bases para empleo, producción y actividad industrial pesquera.", color: "#0f766e" },
];

const fuentes = [
  { nombre: "Agencia de Calidad de la Educación", descripcion: "Bases educativas oficiales.", url: "https://informacionestadistica.agenciaeducacion.cl/#/bases" },
  { nombre: "Observatorio Social", descripcion: "Información oficial de CASEN.", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024" },
  { nombre: "DEIS / MINSAL", descripcion: "Datos abiertos de salud, egresos hospitalarios, nacimientos y estadísticas sanitarias.", url: "https://deis.minsal.cl/#datos-abiertos" },
  { nombre: "Datos.gob.cl", descripcion: "Portal de datos abiertos del Estado de Chile.", url: "https://datos.gob.cl" },
  { nombre: "INE", descripcion: "Bases estadísticas oficiales, incluyendo Encuesta Nacional de Empleo.", url: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral" },
  { nombre: "Banco Central de Chile", descripcion: "Base de Datos Estadísticos con indicadores macroeconómicos y PIB regional.", url: "https://si3.bcentral.cl/Siete" },
  { nombre: "SINCA", descripcion: "Sistema de Información Nacional de Calidad del Aire.", url: "https://sinca.mma.gob.cl/index.php/" },
  { nombre: "ODEPA / Datos ODEPA", descripcion: "Información de precios agrícolas y mercados agropecuarios.", url: "https://datos.odepa.gob.cl" },
  { nombre: "Dirección Meteorológica de Chile", descripcion: "Datos meteorológicos, temperaturas y precipitación.", url: "https://datos.gob.cl" },
  { nombre: "Subsecretaría de Pesca y Acuicultura", descripcion: "Datos sectoriales sobre pesca, acuicultura y empleo en plantas de proceso.", url: "https://datos.gob.cl" },
  { nombre: "Centro de Estudios Públicos", descripcion: "Encuestas nacionales de opinión pública y documentación asociada.", url: "https://www.cepchile.cl/opinion-publica/encuesta-cep/" },
];

const ejercicios = [
  {
    id: "eda-simce",
    tema: "Análisis exploratorio",
    icono: "📈",
    base: "SIMCE 2° medio 2024",
    objetivo:
      "Describir la distribución de los puntajes de Matemática y Lectura y compararlos por tipo de establecimiento.",
    instrucciones: [
      "Cargar y limpiar la base SIMCE.",
      "Seleccionar puntajes de Matemática, Lectura y dependencia.",
      "Crear histogramas y boxplots.",
      "Escribir una interpretación breve.",
    ],
    codigo: `datos <- read.csv("simce2m2024_rbd_preliminar.csv",
                  sep = ";",
                  encoding = "latin1")

datos <- subset(datos,
                prom_mate2m_rbd > 0 &
                prom_lect2m_rbd > 0)

datos$tipo_colegio <- factor(datos$cod_depe2,
                             levels = c(1, 2, 3, 4),
                             labels = c("Municipal",
                                        "Subvencionado",
                                        "Particular_Pagado",
                                        "Administracion_Delegada"))

hist(datos$prom_mate2m_rbd,
     main = "Distribución puntaje Matemática",
     xlab = "Puntaje Matemática")

boxplot(prom_mate2m_rbd ~ tipo_colegio,
        data = datos,
        main = "Matemática por tipo de colegio",
        xlab = "Tipo de colegio",
        ylab = "Puntaje")`,
  },
  {
    id: "anova-aire",
    tema: "ANOVA",
    icono: "📊",
    base: "Calidad del aire - Cerrillos",
    objetivo:
      "Comparar si los registros validados presentan diferencias entre meses.",
    instrucciones: [
      "Cargar la base limpia de calidad del aire.",
      "Definir registros validados como variable respuesta.",
      "Definir mes como factor.",
      "Ajustar un modelo ANOVA e interpretar.",
    ],
    codigo: `datos <- read.csv("datos_final_aire_limpios.csv",
                  sep = ",",
                  header = TRUE)

datos$mes <- factor(datos$mes)

modelo <- aov(reg_validos ~ mes, data = datos)

summary(modelo)

boxplot(reg_validos ~ mes,
        data = datos,
        main = "Registros validados por mes",
        xlab = "Mes",
        ylab = "Registros validados")`,
  },
  {
    id: "regresion-casen",
    tema: "Regresión lineal",
    icono: "📉",
    base: "CASEN 2024",
    objetivo:
      "Estudiar la relación entre años de escolaridad e ingreso total.",
    instrucciones: [
      "Cargar CASEN.",
      "Seleccionar escolaridad e ingreso.",
      "Filtrar datos válidos.",
      "Ajustar una regresión lineal simple.",
    ],
    codigo: `# Antes de correr este código, carga la base CASEN 2024 en R.
# Debe existir un objeto llamado casen_2024.

library(haven)

if (!exists("casen_2024")) {
  stop("Primero carga CASEN 2024 y verifica que el objeto se llame casen_2024")
}

datos <- as.data.frame(casen_2024[, c("esc", "ytot")])

for (v in names(datos)) {
  if (inherits(datos[[v]], "haven_labelled") | inherits(datos[[v]], "labelled")) {
    datos[[v]] <- as.numeric(zap_labels(datos[[v]]))
  }
}

datos <- subset(datos,
                !is.na(esc) &
                !is.na(ytot) &
                esc >= 0 &
                ytot > 0)

datos$log_ytot <- log1p(datos$ytot)

modelo <- lm(log_ytot ~ esc, data = datos)

summary(modelo)

plot(datos$esc, datos$log_ytot,
     xlab = "Años de escolaridad",
     ylab = "Logaritmo del ingreso total")

abline(modelo)`,
  },

];

const proyectos = [
  {
    id: "paes-brechas-colegio",
    titulo: "Brechas de rendimiento PAES según tipo de colegio",
    area: "Educación",
    icono: "🎓",
    base: "PAES 2025",
    datasetId: "paes-2025",
    nivel: "Inicial / intermedio",
    pregunta: "¿Existen diferencias relevantes en los puntajes PAES entre estudiantes de colegios municipales y particulares pagados?",
    hipotesis: [
      "H0: el puntaje promedio no cambia según tipo de colegio.",
      "H1: el puntaje promedio sí cambia según tipo de colegio.",
      "Hipótesis sustantiva: las diferencias de puntaje reflejan desigualdades educativas asociadas al tipo de establecimiento."
    ],
    variables: ["tipo_colegio", "CLEC_REG_ACTUAL", "MATE1_REG_ACTUAL", "PTJE_NEM", "PTJE_RANKING", "CODIGO_REGION"],
    tecnicas: ["Exploratorio", "Boxplots", "t-test", "ANOVA", "Tamaño de efecto", "Comparación por región"],
    pasos: [
      "Filtrar estudiantes con puntajes válidos y primera rendición.",
      "Crear la variable tipo_colegio con las categorías Municipal y Particular pagado.",
      "Comparar distribuciones con boxplots y tablas descriptivas.",
      "Aplicar t-test o ANOVA según la cantidad de grupos a comparar.",
      "Interpretar la diferencia en puntos, no solo el valor p.",
      "Repetir el análisis por región para ver si la brecha se mantiene territorialmente."
    ],
    productos: ["Tabla descriptiva por tipo de colegio", "Boxplot de puntajes", "Test de comparación de medias", "Conclusión en lenguaje no técnico"],
    cuidado: "No interpretar la diferencia como causalidad. El tipo de colegio está asociado a muchas variables sociales que no están controladas directamente.",
    codigo: `# Proyecto: Brechas PAES por tipo de colegio
# Base sugerida: PAES 2025

datos <- read.csv("ArchivoC_Adm2025.csv", sep = ";", stringsAsFactors = FALSE)

datos <- subset(datos,
                GRUPO_DEPENDENCIA %in% c(1, 3) &
                SITUACION_EGRESO %in% c(1, 2, 3, 4) &
                CLEC_REG_ACTUAL > 0 &
                MATE1_REG_ACTUAL > 0)

datos$tipo_colegio <- ifelse(datos$GRUPO_DEPENDENCIA == 1,
                             "Municipal",
                             "Particular pagado")

datos$tipo_colegio <- factor(datos$tipo_colegio)

# Descriptiva
aggregate(MATE1_REG_ACTUAL ~ tipo_colegio, data = datos, mean, na.rm = TRUE)
aggregate(CLEC_REG_ACTUAL ~ tipo_colegio, data = datos, mean, na.rm = TRUE)

# Gráficos
boxplot(MATE1_REG_ACTUAL ~ tipo_colegio,
        data = datos,
        main = "Puntaje Matemática por tipo de colegio",
        xlab = "Tipo de colegio",
        ylab = "Puntaje")

# Test de diferencia de medias
t.test(MATE1_REG_ACTUAL ~ tipo_colegio, data = datos)
t.test(CLEC_REG_ACTUAL ~ tipo_colegio, data = datos)`
  },
  {
    id: "casen-acceso-salud",
    titulo: "Barreras de acceso a salud en CASEN 2024",
    area: "Salud",
    icono: "🏥",
    base: "CASEN 2024 - Salud",
    datasetId: "casen-salud-2024",
    nivel: "Intermedio",
    pregunta: "¿Qué factores sociales y territoriales se asocian con problemas de acceso a atención médica?",
    hipotesis: [
      "H0: la probabilidad de reportar problemas de atención no cambia según pobreza, región o sistema de salud.",
      "H1: la probabilidad de reportar problemas de atención sí cambia según condiciones sociales y territoriales.",
      "Hipótesis sustantiva: las barreras de acceso se concentran en grupos con mayor vulnerabilidad social."
    ],
    variables: ["problema_hora", "problema_costo", "sexo", "edad", "region", "zona_region", "pobreza", "s13_fonasa", "disc_wg"],
    tecnicas: ["Tablas de frecuencia", "Comparación de proporciones", "Chi-cuadrado", "Regresión logística", "Odds ratio"],
    pasos: [
      "Construir una variable binaria de problema de acceso a salud.",
      "Describir la proporción de personas con problema de acceso.",
      "Comparar proporciones según pobreza, sistema de salud y zona territorial.",
      "Aplicar chi-cuadrado para evaluar asociación entre variables categóricas.",
      "Ajustar una regresión logística para estimar asociaciones controlando por varias variables.",
      "Interpretar los odds ratio en lenguaje simple."
    ],
    productos: ["Tabla de proporciones", "Gráfico de barras", "Modelo logístico", "Tabla de odds ratio"],
    cuidado: "Las preguntas de salud pueden tener muchos NA porque no aplican a todas las personas. Hay que revisar el universo de respuesta antes de modelar.",
    codigo: `# Proyecto: Barreras de acceso a salud
# Base sugerida: CASEN 2024 - Salud

# Usar la base limpia creada en la ficha de CASEN Salud:
# datos_final_casen_salud

datos <- datos_final_casen_salud

# Ejemplo con problema para conseguir hora médica
modelo_datos <- subset(datos,
                       !is.na(problema_hora) &
                       !is.na(pobreza) &
                       !is.na(zona_region) &
                       !is.na(sexo))

# Tablas iniciales
prop.table(table(modelo_datos$problema_hora))
prop.table(table(modelo_datos$pobreza, modelo_datos$problema_hora), margin = 1)

# Asociación bivariada
chisq.test(table(modelo_datos$pobreza, modelo_datos$problema_hora))

# Modelo logístico
modelo <- glm(problema_hora ~ pobreza + zona_region + sexo + edad,
              data = modelo_datos,
              family = binomial)

summary(modelo)
exp(coef(modelo))`
  },
  {
    id: "casen-pobreza-territorio",
    titulo: "Pobreza multidimensional y desigualdad territorial",
    area: "Datos sociales",
    icono: "📊",
    base: "CASEN 2024 - Pobreza y desigualdad",
    datasetId: "casen-pobreza-desigualdad-2024",
    nivel: "Inicial / intermedio",
    pregunta: "¿La pobreza multidimensional presenta diferencias territoriales entre regiones y zonas urbanas/rurales?",
    hipotesis: [
      "H0: la proporción de pobreza multidimensional es igual entre territorios.",
      "H1: la proporción de pobreza multidimensional cambia entre territorios.",
      "Hipótesis sustantiva: las desigualdades territoriales se expresan en mayores carencias multidimensionales."
    ],
    variables: ["pobreza_multi", "region", "area", "zona_region", "esc", "ytot", "log_ytot", "nse"],
    tecnicas: ["Tablas cruzadas", "Gráficos de barras", "Chi-cuadrado", "Regresión logística", "Mapeo regional básico"],
    pasos: [
      "Crear una variable binaria de pobreza multidimensional si corresponde.",
      "Comparar proporciones por región y zona urbana/rural.",
      "Ordenar regiones según porcentaje de pobreza multidimensional.",
      "Aplicar chi-cuadrado para evaluar asociación territorial.",
      "Construir un modelo logístico simple con región, zona y escolaridad.",
      "Interpretar resultados desde una pregunta de política pública."
    ],
    productos: ["Ranking regional", "Gráfico de barras por región", "Chi-cuadrado", "Modelo logístico simple"],
    cuidado: "Para variables de hogar o ingreso conviene evitar duplicar hogares. Si se trabaja a nivel hogar, usar jefe/a de hogar cuando corresponda.",
    codigo: `# Proyecto: Pobreza multidimensional y territorio
# Base sugerida: CASEN 2024 - Pobreza y desigualdad

datos <- datos_final_casen_pobreza

# Revisar variable de pobreza multidimensional
table(datos$pobreza_multi, useNA = "ifany")

# Proporción por zona urbana/rural
prop.table(table(datos$area, datos$pobreza_multi), margin = 1)

# Asociación territorial
chisq.test(table(datos$area, datos$pobreza_multi))

# Modelo logístico si pobreza_multi está codificada como 0/1 o similar
modelo_datos <- subset(datos,
                       !is.na(pobreza_multi) &
                       !is.na(area) &
                       !is.na(esc))

modelo <- glm(pobreza_multi ~ area + esc + sexo + edad,
              data = modelo_datos,
              family = binomial)

summary(modelo)
exp(coef(modelo))`
  },
  {
    id: "ene-informalidad-laboral",
    titulo: "Informalidad laboral y desigualdad en la ENE",
    area: "Trabajo",
    icono: "💼",
    base: "Encuesta Nacional de Empleo 2026",
    datasetId: "ene-2026",
    nivel: "Intermedio",
    pregunta: "¿Qué características se asocian con la informalidad laboral en Chile?",
    hipotesis: [
      "H0: la informalidad laboral no se asocia con sexo, edad, región o nivel educacional.",
      "H1: la informalidad laboral sí se asocia con características sociodemográficas y territoriales.",
      "Hipótesis sustantiva: la informalidad se concentra en ciertos grupos con mayor precariedad laboral."
    ],
    variables: ["ocup_form", "sexo", "edad", "region", "nivel", "categoria_ocupacion", "habituales", "fact_cal"],
    tecnicas: ["Tablas de contingencia", "Comparación de proporciones", "Chi-cuadrado", "Regresión logística", "Gráficos de barras"],
    pasos: [
      "Filtrar población ocupada.",
      "Identificar la variable de formalidad o informalidad laboral.",
      "Comparar informalidad por sexo, edad, región y nivel educacional.",
      "Aplicar chi-cuadrado para asociaciones categóricas.",
      "Ajustar una regresión logística de informalidad.",
      "Interpretar grupos con mayor o menor probabilidad estimada."
    ],
    productos: ["Tabla de informalidad por grupo", "Gráfico de proporciones", "Chi-cuadrado", "Regresión logística"],
    cuidado: "La ENE tiene ponderadores. Para una versión inicial se puede trabajar sin ponderar, pero en un informe formal conviene considerar factores de expansión.",
    codigo: `# Proyecto: Informalidad laboral
# Base sugerida: Encuesta Nacional de Empleo

datos <- read.csv("ene-2026-02-efm.csv", sep = ";", stringsAsFactors = FALSE)

# Filtrar población ocupada si activ == 1
datos <- subset(datos, edad >= 15 & activ == 1)

datos$sexo <- factor(datos$sexo, levels = c(1, 2), labels = c("Hombre", "Mujer"))
datos$region <- factor(datos$region)
datos$nivel <- factor(datos$nivel)
datos$ocup_form <- factor(datos$ocup_form)

# Revisar informalidad
table(datos$ocup_form, useNA = "ifany")
prop.table(table(datos$sexo, datos$ocup_form), margin = 1)

# Asociación por sexo
chisq.test(table(datos$sexo, datos$ocup_form))

# Modelo logístico: ajustar los códigos de ocup_form según diccionario
# Ejemplo: informal = 1 si ocup_form indica informalidad
datos$informal <- ifelse(datos$ocup_form == 2, 1,
                         ifelse(datos$ocup_form == 1, 0, NA))

modelo <- glm(informal ~ sexo + edad + region + nivel,
              data = datos,
              family = binomial)

summary(modelo)
exp(coef(modelo))`
  },
  {
    id: "sismos-riesgo-territorial",
    titulo: "Sismos, magnitud y concentración territorial",
    area: "Medio ambiente",
    icono: "🌎",
    base: "Sismos en Chile - mapa interactivo y asignación regional",
    datasetId: "sismos-chile-mapa-interactivo",
    nivel: "Intermedio / aplicado",
    pregunta: "¿Qué regiones concentran más sismos y cómo cambia la magnitud o profundidad según macrozona?",
    hipotesis: [
      "H0: la magnitud y profundidad de los sismos no cambian según macrozona.",
      "H1: la magnitud o profundidad sí presenta diferencias entre macrozonas.",
      "Hipótesis sustantiva: la distribución espacial de los sismos muestra patrones territoriales diferenciados."
    ],
    variables: ["latitud", "longitud", "magnitud", "profundidad", "region_asignada", "metodo_asignacion_region", "macrozona", "sismo_mayor_5"],
    tecnicas: ["Análisis espacial", "Mapa interactivo", "Resumen por región", "Kruskal-Wallis", "ANOVA", "Chi-cuadrado"],
    pasos: [
      "Cargar la base de sismos con coordenadas.",
      "Convertir coordenadas en puntos espaciales.",
      "Asignar región mediante cruce con polígonos regionales.",
      "Construir resúmenes por región y macrozona.",
      "Visualizar el mapa interactivo y revisar eventos en el mar.",
      "Comparar magnitud y profundidad entre macrozonas."
    ],
    productos: ["Base con región asignada", "Mapa interactivo HTML", "Resumen por región", "Test por macrozona"],
    cuidado: "Los sismos marinos no se mueven dentro de la región. Se mantienen en su coordenada real y se asignan a la región más cercana solo para resumir resultados.",
    codigo: `# Proyecto: Sismos y concentración territorial
# Base sugerida: sismos_chile_con_region.csv

datos <- read.csv("sismos_chile_con_region.csv", stringsAsFactors = FALSE)

# Cantidad por región
sort(table(datos$region_asignada), decreasing = TRUE)

# Magnitud promedio por región
aggregate(magnitud ~ region_asignada, data = datos, mean, na.rm = TRUE)

# Comparación de profundidad por macrozona
kruskal.test(profundidad ~ macrozona, data = datos)

# Comparación de magnitud por macrozona
kruskal.test(magnitud ~ macrozona, data = datos)

# Eventos fuertes por macrozona
tabla <- table(datos$macrozona, datos$sismo_mayor_5)
tabla
chisq.test(tabla)`
  },
  {
    id: "cep-opinion-publica-comparada",
    titulo: "Cambio en opinión pública entre CEP 2023 y CEP 2024",
    area: "Opinión pública",
    icono: "🏛️",
    base: "Encuesta CEP 2023-2024 comparada",
    datasetId: "cep-89-91-comparacion",
    nivel: "Intermedio",
    pregunta: "¿Cambió la aprobación del gobierno o la posición ideológica declarada entre 2023 y 2024?",
    hipotesis: [
      "H0: la distribución de aprobación del gobierno no cambia entre años.",
      "H1: la distribución de aprobación del gobierno cambia entre años.",
      "Hipótesis sustantiva: la opinión pública puede variar entre mediciones y esas diferencias pueden observarse por sexo, edad o zona."
    ],
    variables: ["anio", "sexo", "edad", "region", "zona_u_r", "eval_gob_1", "aprueba_gobierno", "iden_pol_2", "posicion_ideologica", "pond"],
    tecnicas: ["Tablas ponderadas", "Comparación temporal", "Chi-cuadrado", "Comparación de medias", "Gráficos de barras"],
    pasos: [
      "Cargar CEP 89 y CEP 91.",
      "Seleccionar solo variables comparables entre ambas mediciones.",
      "Homologar nombres de variables, especialmente región.",
      "Crear una variable anio para distinguir 2023 y 2024.",
      "Comparar aprobación del gobierno por año usando tablas ponderadas.",
      "Revisar si los cambios se mantienen por sexo o grupo de edad."
    ],
    productos: ["Tabla comparativa por año", "Gráfico de aprobación", "Chi-cuadrado", "Promedio de posición ideológica por año"],
    cuidado: "Antes de comparar años, hay que verificar que la pregunta y la codificación sean equivalentes en ambos cuestionarios.",
    codigo: `# Proyecto: Opinión pública CEP comparada
# Base sugerida: CEP 89 vs CEP 91

cep89 <- read.csv("base_89.csv", stringsAsFactors = FALSE)
cep91 <- read.csv("base_91.csv", stringsAsFactors = FALSE)

variables_89 <- c("sexo", "edad", "region", "zona_u_r", "pond", "eval_gob_1", "iden_pol_2")
variables_91 <- c("sexo", "edad", "region_3", "zona_u_r", "pond", "eval_gob_1", "iden_pol_2")

cep89 <- cep89[, variables_89[variables_89 %in% names(cep89)]]
cep91 <- cep91[, variables_91[variables_91 %in% names(cep91)]]

names(cep91)[names(cep91) == "region_3"] <- "region"

cep89$anio <- 2023
cep91$anio <- 2024

datos <- rbind(cep89, cep91)

datos$aprueba_gobierno <- ifelse(datos$eval_gob_1 == 1, 1,
                                 ifelse(datos$eval_gob_1 == 2, 0, NA))

datos$posicion_ideologica <- ifelse(datos$iden_pol_2 %in% 1:10,
                                    datos$iden_pol_2,
                                    NA)

# Aprobación ponderada por año
tabla <- xtabs(pond ~ anio + aprueba_gobierno, data = datos)
prop.table(tabla, margin = 1)

# Posición ideológica promedio por año
aggregate(posicion_ideologica ~ anio, data = datos, mean, na.rm = TRUE)`
  }
];


const filtrosDisponibles = {
  tamano: ["Pequeña", "Mediana", "Grande"],
  analisis: ["Exploratorio", "t-test", "ANOVA", "Regresión", "Regresión lineal", "Regresión logística", "Correlación", "Análisis temporal básico", "Tasas", "Comparación de proporciones", "Tablas de frecuencia"],
};

const s = {
  page: { minHeight: "100vh", background: "#f5f7fb", fontFamily: "Arial, Helvetica, sans-serif", color: "#111827" },
  header: { background: "#0b1220", color: "white", padding: "18px 56px", borderBottom: "4px solid #1d4ed8", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" },
  headerTitle: { margin: 0, fontSize: "22px", fontWeight: 700 },
  headerSubtitle: { margin: "5px 0 0 0", color: "#cbd5e1", fontSize: "14px" },
  nav: { display: "flex", gap: "18px", fontSize: "14px" },
  navItem: { color: "#e5e7eb", cursor: "pointer" },
  mainWrap: { width: "100%", padding: "34px 56px" },
  heroFormal: { background: "white", borderRadius: "8px", border: "1px solid #dbe3ef", padding: "38px 44px", boxShadow: "0 6px 18px rgba(15,23,42,0.06)", marginBottom: "30px" },
  eyebrow: { margin: 0, color: "#1d4ed8", fontWeight: 700, letterSpacing: "0.04em", fontSize: "14px", textTransform: "uppercase" },
  brandTitle: { fontSize: "38px", margin: "8px 0 0 0", color: "#111827", lineHeight: 1.15 },
  brandText: { color: "#334155", fontSize: "17px", lineHeight: 1.7, maxWidth: "1000px", marginTop: "12px" },
  searchBox: { width: "100%", padding: "15px 16px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "15px", outline: "none", marginTop: "24px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginTop: "22px" },
  statCard: { background: "#f8fafc", border: "1px solid #dbe3ef", borderRadius: "8px", padding: "16px" },
  statNumber: { fontSize: "26px", fontWeight: 700, color: "#0b1220", margin: 0 },
  statLabel: { color: "#475569", margin: "4px 0 0 0", fontSize: "14px" },
  title: { fontSize: "30px", margin: "10px 0 8px 0", fontWeight: 700 },
  sectionSubtitle: { color: "#475569", marginTop: 0, marginBottom: "20px", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px", marginTop: "18px" },
  card: { background: "white", borderRadius: "8px", border: "1px solid #dbe3ef", padding: "24px", boxShadow: "0 6px 18px rgba(15,23,42,0.05)" },
  iconBox: { width: "42px", height: "42px", borderRadius: "8px", background: "#eef4ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" },
  smallMuted: { color: "#475569", fontSize: "14px", lineHeight: 1.6 },
  badge: { display: "inline-block", padding: "7px 12px", borderRadius: "999px", background: "#eef4ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: "13px", marginRight: "8px", marginBottom: "8px" },
  button: { background: "#0b1220", color: "white", border: "none", borderRadius: "6px", padding: "11px 15px", cursor: "pointer", fontWeight: 700 },
  buttonAlt: { background: "white", color: "#0b1220", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "11px 15px", cursor: "pointer", fontWeight: 700 },
  meta: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", color: "#334155", fontSize: "14px", margin: "14px 0" },
  layout: { display: "grid", gridTemplateColumns: "300px 1fr", gap: "22px", alignItems: "start" },
  sidebar: { background: "white", borderRadius: "8px", border: "1px solid #dbe3ef", padding: "22px", boxShadow: "0 6px 18px rgba(15,23,42,0.05)", position: "sticky", top: "20px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", marginTop: "8px" },
  twoCol: { display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "22px", alignItems: "start" },
  pre: { background: "#0b1220", color: "#e5e7eb", borderRadius: "8px", padding: "22px", fontSize: "14px", lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre", textAlign: "left", fontFamily: "Consolas, 'Courier New', monospace" },
  linkBox: { background: "#f8fafc", border: "1px solid #dbe3ef", borderRadius: "8px", padding: "16px", marginTop: "18px", color: "#334155" },
  stepCard: { background: "#f8fafc", border: "1px solid #dbe3ef", borderRadius: "8px", padding: "18px", marginTop: "14px" },
  stepHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  stepNumber: { width: "30px", height: "30px", borderRadius: "999px", background: "#0b1220", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flex: "0 0 auto" },
  miniPre: { background: "#0b1220", color: "#e5e7eb", borderRadius: "8px", padding: "14px", fontSize: "13px", lineHeight: 1.55, overflowX: "auto", whiteSpace: "pre", textAlign: "left", fontFamily: "Consolas, 'Courier New', monospace", marginTop: "10px" },
};

function normalizarTexto(valor) {
  return String(valor ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function textoBuscableDataset(dataset) {
  return [
    dataset.id,
    dataset.nombre,
    dataset.area,
    dataset.icono,
    dataset.formato,
    dataset.tamano,
    dataset.fuenteNombre,
    dataset.unidad,
    dataset.descripcion,
    dataset.contexto,
    dataset.usos,
    dataset.fuenteOriginal,
    ...(dataset.analisis || []),
    ...(dataset.tecnicas || []),
    ...(dataset.preguntas || []),
    ...(dataset.variables || []),
    ...(dataset.sugerenciasFiltros || []),
  ].join(" ");
}

function coincideBusquedaDataset(dataset, busqueda) {
  const q = normalizarTexto(busqueda);
  if (!q) return true;
  return normalizarTexto(textoBuscableDataset(dataset)).includes(q);
}

function textoBuscableEjercicio(exercise) {
  return [
    exercise.id,
    exercise.tema,
    exercise.base,
    exercise.objetivo,
    ...(exercise.instrucciones || []),
  ].join(" ");
}

function coincideBusquedaEjercicio(exercise, busqueda) {
  const q = normalizarTexto(busqueda);
  if (!q) return true;
  return normalizarTexto(textoBuscableEjercicio(exercise)).includes(q);
}



function textoBuscableProyecto(proyecto) {
  return [
    proyecto.id,
    proyecto.titulo,
    proyecto.area,
    proyecto.base,
    proyecto.nivel,
    proyecto.pregunta,
    proyecto.cuidado,
    ...(proyecto.hipotesis || []),
    ...(proyecto.variables || []),
    ...(proyecto.tecnicas || []),
    ...(proyecto.pasos || []),
    ...(proyecto.productos || []),
  ].join(" ");
}

function coincideBusquedaProyecto(proyecto, busqueda) {
  const q = normalizarTexto(busqueda);
  if (!q) return true;
  return normalizarTexto(textoBuscableProyecto(proyecto)).includes(q);
}

function descargarCodigoProyecto(proyecto) {
  const contenido = proyecto?.codigo || "# Código pendiente para este proyecto";
  const nombreBase = (proyecto?.id || proyecto?.titulo || "proyecto")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `${nombreBase || "proyecto"}.R`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

function GlobalSearch({ onOpenDataset }) {
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);

  const resultados = useMemo(() => {
    const q = busqueda.trim();
    if (!q) return [];
    return datasets.filter((d) => coincideBusquedaDataset(d, q)).slice(0, 8);
  }, [busqueda]);

  const abrirResultado = (dataset) => {
    setBusqueda("");
    setAbierto(false);
    onOpenDataset(dataset, "inicio");
  };

  const ejecutarBusqueda = () => {
    const termino = busqueda.trim();
    if (!termino) return;
    setAbierto(false);
    window.location.hash = `#/busqueda/${encodeURIComponent(termino)}`;
  };

  return (
    <div style={{ position: "relative", width: "min(460px, 100%)" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <input
        aria-label="Buscar datasets"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "6px",
          border: "1px solid #334155",
          background: "#111827",
          color: "white",
          outline: "none",
          fontSize: "14px",
        }}
        placeholder="Buscar dataset..."
        value={busqueda}
        onFocus={() => setAbierto(true)}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setAbierto(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            ejecutarBusqueda();
          }
          if (e.key === "Escape") setAbierto(false);
        }}
      />
      <button
        type="button"
        onClick={ejecutarBusqueda}
        style={{
          padding: "10px 14px",
          borderRadius: "6px",
          border: "1px solid #2563eb",
          background: "#2563eb",
          color: "white",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Buscar
      </button>
      </div>

      {abierto && busqueda.trim() && (
        <div
          style={{
            position: "absolute",
            top: "46px",
            right: 0,
            width: "420px",
            maxWidth: "90vw",
            background: "white",
            color: "#0f172a",
            border: "1px solid #dbe3ef",
            borderRadius: "8px",
            boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", fontSize: "13px", color: "#64748b" }}>
            {resultados.length > 0 ? `${resultados.length} resultado(s)` : "No se encontraron resultados"}
          </div>
          {resultados.map((d) => (
            <button
              key={d.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => abrirResultado(d)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid #eef2f7",
                background: "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 700, color: "#0f172a" }}>{d.nombre}</div>
              <div style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>{d.area} · {d.fuenteNombre}</div>
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const termino = busqueda.trim();
              setAbierto(false);
              if (termino) window.location.hash = `#/busqueda/${encodeURIComponent(termino)}`;
              else window.location.hash = "#/catalogo";
            }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 14px",
              border: "none",
              background: "#f8fafc",
              color: "#1d4ed8",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ver todos los resultados
          </button>
        </div>
      )}
    </div>
  );
}

function DatasetCard({ d, onOpenDataset }) {
  return (
    <div key={d.id} style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 700 }}>{d.area}</p>
          <h3 style={{ margin: "6px 0 8px 0", fontSize: "22px" }}>{d.nombre}</h3>
        </div>
        <div style={s.iconBox}>{d.icono}</div>
      </div>
      <p style={s.smallMuted}>{d.descripcion}</p>
      <div style={{ margin: "12px 0" }}>
        {d.analisis.slice(0, 3).map((item) => <span key={item} style={s.badge}>{item}</span>)}
      </div>
      <div style={s.meta}>
        <div><strong>Formato:</strong> {d.formato}</div>
        <div><strong>Tamaño:</strong> {d.tamano}</div>
        <div><strong>Variables:</strong> {d.variables.length}</div>
        <div><strong>Fuente:</strong> {d.fuenteNombre}</div>
      </div>
      <button style={s.button} onClick={() => onOpenDataset(d, "inicio")}>Ver ficha</button>
    </div>
  );
}



function ProjectCard({ proyecto, onOpenProject, onOpenDataset }) {
  const datasetRelacionado = datasets.find((d) => d.id === proyecto.datasetId);

  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 700 }}>{proyecto.area}</p>
          <h3 style={{ margin: "6px 0 8px 0", fontSize: "22px" }}>{proyecto.titulo}</h3>
        </div>
        <div style={s.iconBox}>{proyecto.icono}</div>
      </div>
      <p style={s.smallMuted}><strong>Pregunta:</strong> {proyecto.pregunta}</p>
      <p style={s.smallMuted}><strong>Base sugerida:</strong> {proyecto.base}</p>
      <div style={{ margin: "12px 0" }}>
        {(proyecto.tecnicas || []).slice(0, 4).map((item) => <span key={item} style={s.badge}>{item}</span>)}
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button style={s.button} onClick={() => onOpenProject(proyecto)}>Ver proyecto</button>
        {datasetRelacionado && (
          <button style={s.buttonAlt} onClick={() => onOpenDataset(datasetRelacionado, "proyectos")}>Ver base</button>
        )}
      </div>
    </div>
  );
}

function ProjectsPage({ onBack, onOpenProject, onOpenDataset }) {
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState("");

  const filtrados = useMemo(() => {
    return proyectos
      .filter((p) => (area ? p.area === area : true))
      .filter((p) => coincideBusquedaProyecto(p, busqueda));
  }, [busqueda, area]);

  const areasProyecto = Array.from(new Set(proyectos.map((p) => p.area)));

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a la portada</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>Proyectos guiados</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>Ideas de proyecto con pregunta, hipótesis y test</h1>
        <p style={s.brandText}>
          Esta sección está pensada para estudiantes que están recién entrando a trabajar con datos. Cada proyecto parte desde una base del repertorio y propone una pregunta de investigación, hipótesis, variables, pruebas estadísticas y un código inicial en R.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "14px", marginTop: "22px" }}>
          <input style={{ ...s.searchBox, marginTop: 0 }} placeholder="Buscar proyecto, técnica o base..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select style={s.input} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Todas las áreas</option>
            {areasProyecto.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <p style={s.sectionSubtitle}>{filtrados.length} proyecto(s) disponible(s)</p>
      <div style={s.grid}>
        {filtrados.map((proyecto) => (
          <ProjectCard
            key={proyecto.id}
            proyecto={proyecto}
            onOpenProject={onOpenProject}
            onOpenDataset={onOpenDataset}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectPage({ proyecto, onBack, onOpenDataset }) {
  if (!proyecto) {
    return (
      <div>
        <button style={s.buttonAlt} onClick={onBack}>← Volver</button>
        <div style={s.card}>
          <h2>No se encontró el proyecto</h2>
          <p style={{ color: "#475569" }}>Vuelve a la sección de proyectos y selecciona nuevamente.</p>
        </div>
      </div>
    );
  }

  const datasetRelacionado = datasets.find((d) => d.id === proyecto.datasetId);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a proyectos</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>{proyecto.area} · {proyecto.nivel}</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>{proyecto.titulo}</h1>
        <p style={s.brandText}>{proyecto.pregunta}</p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
          {datasetRelacionado && (
            <button style={s.button} onClick={() => onOpenDataset(datasetRelacionado, "proyectos")}>Abrir ficha de la base</button>
          )}
          <button style={s.buttonAlt} onClick={() => descargarCodigoProyecto(proyecto)}>Descargar código del proyecto en R</button>
        </div>
      </div>

      <div style={s.twoCol}>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Planteamiento del proyecto</h2>
            <p style={{ color: "#475569", lineHeight: 1.7 }}><strong>Base sugerida:</strong> {proyecto.base}</p>
            <p style={{ color: "#475569", lineHeight: 1.7 }}><strong>Pregunta de investigación:</strong> {proyecto.pregunta}</p>
            <h3>Hipótesis</h3>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
              {(proyecto.hipotesis || []).map((h) => <li key={h}>{h}</li>)}
            </ul>
            <div style={{ marginTop: "14px", padding: "12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", color: "#9a3412", lineHeight: 1.65 }}>
              <strong>Cuidado metodológico:</strong> {proyecto.cuidado}
            </div>
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Ruta de trabajo sugerida</h2>
            {(proyecto.pasos || []).map((paso, index) => (
              <div key={paso} style={s.stepCard}>
                <div style={s.stepHeader}>
                  <div style={s.stepNumber}>{index + 1}</div>
                  <h3 style={{ margin: 0 }}>{paso}</h3>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Código inicial en R</h2>
            <p style={{ color: "#475569", lineHeight: 1.65, marginTop: 0 }}>
              Este código no reemplaza el análisis completo, pero deja un punto de partida claro para que el estudiante pueda adaptar el proyecto a su propia pregunta.
            </p>
            <button style={s.button} onClick={() => descargarCodigoProyecto(proyecto)}>Descargar código del proyecto en R</button>
            <pre style={s.pre}>{proyecto.codigo}</pre>
          </div>
        </div>

        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Variables clave</h2>
            {(proyecto.variables || []).map((v) => <span key={v} style={s.badge}>{v}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Tests y técnicas</h2>
            {(proyecto.tecnicas || []).map((t) => <span key={t} style={s.badge}>{t}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Productos esperados</h2>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
              {(proyecto.productos || []).map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsPage({ query, onBack, onOpenDataset }) {
  const resultados = useMemo(() => {
    const termino = normalizarTexto(query || "");
    if (!termino) return datasets;
    return datasets.filter((d) => coincideBusquedaDataset(d, termino));
  }, [query]);

  return (
    <div>
      <button style={s.buttonAlt} onClick={onBack}>← Volver al inicio</button>
      <div style={s.card}>
        <h2 style={s.title}>Resultados de búsqueda</h2>
        <p style={s.sectionSubtitle}>Búsqueda: <strong>{query}</strong>. Se muestran todas las bases que coinciden con el nombre, área, fuente, variables, técnicas o preguntas.</p>
      </div>
      <div style={s.grid}>
        {resultados.map((d) => (
          <DatasetCard
            key={d.id}
            d={d}
            onOpenDataset={(dataset) => onOpenDataset(dataset, "busqueda")}
          />
        ))}
      </div>
      {resultados.length === 0 && (
        <div style={s.card}>
          <p style={s.sectionSubtitle}>No se encontraron resultados para esa búsqueda.</p>
        </div>
      )}
    </div>
  );
}

function Home({ onOpenArea, onOpenDataset, onOpenExercise, onOpenCatalog, onOpenAreas, onOpenProjects, onOpenProject }) {
  const resultadosBusqueda = datasets.slice(0, 8);
  const areasDestacadas = areas.slice(0, 6);
  const proyectosDestacados = proyectos.slice(0, 6);

  return (
    <div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>Repertorio de bases de datos chilenas</p>
        <h1 style={s.brandTitle}>Catálogo académico para análisis estadístico con datos reales</h1>
        <p style={s.brandText}>
          Plataforma que reúne bases de datos chilenas organizadas por área, fuente oficial, formato,
          variables disponibles y técnicas estadísticas sugeridas. Cada ficha incluye contexto,
          preguntas de investigación y un script base en R para iniciar la limpieza de los datos.
        </p>
        <div style={s.statsGrid}>
          <div style={s.statCard}><p style={s.statNumber}>{datasets.length}</p><p style={s.statLabel}>datasets incorporados</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{areas.length}</p><p style={s.statLabel}>áreas temáticas</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{fuentes.length}</p><p style={s.statLabel}>fuentes oficiales</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{proyectos.length}</p><p style={s.statLabel}>proyectos guiados</p></div>
        </div>
      </div>

      <h2 style={s.title}>Sobre el repertorio</h2>
      <p style={s.sectionSubtitle}>Apoyo inicial para estudiantes que necesitan trabajar con datos reales.</p>
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginTop: "40px" }}>
        <div>
          <h2 id="datasets" style={s.title}>Datasets destacados</h2>
          <p style={s.sectionSubtitle}>Vista inicial con una selección de bases. Para ver el catálogo completo, usa el botón Ver más.</p>
        </div>
        <button style={s.buttonAlt} onClick={onOpenCatalog}>Ver más datasets</button>
      </div>

      <div style={s.grid}>
        {resultadosBusqueda.map((d) => <DatasetCard key={d.id} d={d} onOpenDataset={onOpenDataset} />)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginTop: "40px" }}>
        <div>
          <h2 id="areas" style={s.title}>Explorar por área</h2>
          <p style={s.sectionSubtitle}>Entra a una categoría específica para filtrar bases según tamaño o técnica principal.</p>
        </div>
        <button style={s.buttonAlt} onClick={onOpenAreas}>Ver más áreas</button>
      </div>

      <div style={s.grid}>
        {areasDestacadas.map((area) => (
          <div key={area.nombre} style={s.card}>
            <div style={{ height: "6px", borderRadius: "999px", background: area.color, marginBottom: "18px" }} />
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={s.iconBox}>{area.icono}</div>
              <h3 style={{ fontSize: "24px", margin: 0 }}>{area.nombre}</h3>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.6 }}>{area.descripcion}</p>
            <button style={s.button} onClick={() => onOpenArea(area.nombre)}>Entrar al área</button>
          </div>
        ))}
      </div>



      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginTop: "40px" }}>
        <div>
          <h2 id="proyectos" style={s.title}>Proyectos guiados</h2>
          <p style={s.sectionSubtitle}>Ideas listas para partir: pregunta, hipótesis, variables, test recomendado y código inicial en R.</p>
        </div>
        <button style={s.buttonAlt} onClick={onOpenProjects}>Ver todos los proyectos</button>
      </div>

      <div style={s.grid}>
        {proyectosDestacados.map((proyecto) => (
          <ProjectCard
            key={proyecto.id}
            proyecto={proyecto}
            onOpenProject={onOpenProject}
            onOpenDataset={onOpenDataset}
          />
        ))}
      </div>

      <h2 id="fuentes" style={{ ...s.title, marginTop: "40px" }}>Fuentes oficiales</h2>
      <p style={s.sectionSubtitle}>
        Referencias oficiales de origen. Se muestran en formato compacto para no ocupar demasiado espacio en la portada.
      </p>
      <div style={{ ...s.card, padding: "18px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {fuentes.map((fuente) => (
            <a
              key={fuente.nombre}
              href={fuente.url}
              target="_blank"
              rel="noreferrer"
              title={fuente.descripcion}
              style={{
                textDecoration: "none",
                color: "#0b1220",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                borderRadius: "999px",
                padding: "9px 12px",
                fontSize: "13px",
                fontWeight: 700
              }}
            >
              {fuente.nombre}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}

function CatalogPage({ onBack, onOpenDataset }) {
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState("");

  const filtrados = useMemo(() => {
    return datasets
      .filter((d) => (area ? d.area === area : true))
      .filter((d) => coincideBusquedaDataset(d, busqueda));
  }, [busqueda, area]);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a la portada</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>Catálogo completo</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>Todos los datasets</h1>
        <p style={s.brandText}>Aquí aparecen todas las bases incorporadas actualmente al repertorio.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "14px", marginTop: "22px" }}>
          <input style={{ ...s.searchBox, marginTop: 0 }} placeholder="Buscar dataset, variable o técnica..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select style={s.input} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Todas las áreas</option>
            {areas.map((a) => <option key={a.nombre} value={a.nombre}>{a.nombre}</option>)}
          </select>
        </div>
      </div>
      <p style={s.sectionSubtitle}>{filtrados.length} resultado(s)</p>
      <div style={s.grid}>
        {filtrados.map((d) => <DatasetCard key={d.id} d={d} onOpenDataset={onOpenDataset} />)}
      </div>
    </div>
  );
}

function AreasListPage({ onBack, onOpenArea }) {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a la portada</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>Áreas temáticas</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>Explorar todas las áreas</h1>
        <p style={s.brandText}>Selecciona un área para ver únicamente las bases asociadas a ese tema.</p>
      </div>
      <div style={s.grid}>
        {areas.map((area) => (
          <div key={area.nombre} style={s.card}>
            <div style={{ height: "6px", borderRadius: "999px", background: area.color, marginBottom: "18px" }} />
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={s.iconBox}>{area.icono}</div>
              <h3 style={{ fontSize: "24px", margin: 0 }}>{area.nombre}</h3>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.6 }}>{area.descripcion}</p>
            <button style={s.button} onClick={() => onOpenArea(area.nombre)}>Ver datasets del área</button>
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
      .filter((d) => coincideBusquedaDataset(d, busqueda))
      .filter((d) => (tamano ? d.tamano === tamano : true))
      .filter((d) => (analisis ? d.analisis.includes(analisis) : true));
  }, [area, busqueda, tamano, analisis]);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a áreas</button>
      </div>
      <div style={s.layout}>
        <div style={s.sidebar}>
          <h2 style={{ marginTop: 0 }}>{area}</h2>
          <div style={{ marginBottom: "16px" }}>
            <strong>Buscar</strong>
            <input style={s.input} placeholder="Base, variable o técnica..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <strong>Tamaño</strong>
            <select style={s.input} value={tamano} onChange={(e) => setTamano(e.target.value)}>
              <option value="">Todos</option>
              {filtrosDisponibles.tamano.map((op) => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>
          <div>
            <strong>Técnica principal</strong>
            <select style={s.input} value={analisis} onChange={(e) => setAnalisis(e.target.value)}>
              <option value="">Todas</option>
              {filtrosDisponibles.analisis.map((op) => <option key={op} value={op}>{op}</option>)}
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
              <h3 style={{ fontSize: "24px", marginTop: 0 }}>{d.nombre}</h3>
              <p style={{ color: "#475569", lineHeight: 1.6 }}>{d.descripcion}</p>
              {d.analisis.map((item) => <span key={item} style={s.badge}>{item}</span>)}
              <div style={s.meta}>
                <div><strong>Formato:</strong> {d.formato}</div>
                <div><strong>Tamaño:</strong> {d.tamano}</div>
                <div><strong>Variables:</strong> {d.variables.length}</div>
                <div><strong>Fuente:</strong> {d.fuenteNombre}</div>
              </div>
              <button style={s.button} onClick={() => onOpenDataset(d, "area")}>Ver ficha completa</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function getArchivoNombre(dataset) {
  if (dataset.descarga) return dataset.descarga.split("/").pop();
  if (dataset.formato === "RData") return "archivo .RData descargado desde la fuente oficial";
  return "archivo descargado desde la fuente oficial";
}

function getCargaCodigo(dataset) {
  const archivo = getArchivoNombre(dataset);
  if (dataset.formato === "XLSX") {
    return `library(readxl)\n\ndatos <- read_excel("${archivo}")\nhead(datos)\nnames(datos)`;
  }
  if (dataset.formato === "RData") {
    return `# Antes de correr este código, carga la base CASEN 2024 en R.\n# Debe existir un objeto llamado casen_2024.\n\ndatos <- casen_2024\nhead(datos)\nnames(datos)`;
  }
  const sep = dataset.id.includes("defunciones") ? "|" : dataset.id.includes("simce") || dataset.id.includes("egresos") || dataset.id.includes("ene") ? ";" : ",";
  return `datos <- read.csv("${archivo}",\n                  sep = "${sep}",\n                  stringsAsFactors = FALSE)\n\nhead(datos)\nnames(datos)`;
}

function buildDatasetGuide(dataset) {
  const archivo = getArchivoNombre(dataset);
  const variablesSeguras = Array.isArray(dataset?.variables) ? dataset.variables : [];
  const analisisSeguros = Array.isArray(dataset?.analisis) ? dataset.analisis : [];
  const vars = variablesSeguras.slice(0, 10).map((v) => `  "${v}"`).join(",\n");
  const isLocal = Boolean(dataset?.descarga || dataset?.descargas);

  return [
    {
      titulo: "Descargar o ubicar la base",
      texto: isLocal
        ? `Descarga el archivo desde la ficha o verifica que esté guardado como ${archivo}. Para trabajar en R, el archivo debe quedar en la misma carpeta de trabajo o debes indicar su ruta.`
        : `Esta base se deja con fuente oficial porque el archivo puede ser muy pesado o no conviene subirlo completo al repositorio. Primero descárgalo desde el sitio original y guárdalo con el nombre indicado en el script.`,
      codigo: `# Archivo esperado\n# ${archivo}\n\n# Fuente oficial\n# ${dataset.fuenteOriginal}`,
      resultado: "Al final de este paso tienes el archivo disponible para cargarlo en R."
    },
    {
      titulo: "Cargar la base y revisar su estructura",
      texto: "El primer paso en R no es analizar inmediatamente, sino abrir la base, mirar sus nombres de variables y revisar las primeras filas.",
      codigo: getCargaCodigo(dataset),
      resultado: "Deberías ver las primeras observaciones y una lista de nombres de columnas. Esto permite comprobar que el archivo se leyó correctamente."
    },
    {
      titulo: "Seleccionar variables principales",
      texto: "Para comenzar, se trabaja con un subconjunto de variables que tienen sentido para preguntas simples. Esto hace que la base sea más manejable para estudiantes que están partiendo.",
      codigo: `# Variables sugeridas para esta base\nvariables_principales <- c(\n${vars}\n)\n\nvariables_principales`,
      resultado: `La base queda orientada a la unidad de análisis: ${dataset.unidad || "registros de la base"}.`
    },
    {
      titulo: "Limpiar y transformar variables",
      texto: "Aquí se eliminan registros no válidos, se convierten variables categóricas a factor y se crean variables nuevas cuando ayudan a interpretar mejor los datos.",
      codigo: `# Ejecuta el script completo de limpieza que aparece más abajo\n# Luego revisa:\n\ncolSums(is.na(datos))\nsummary(datos)`,
      resultado: "La idea es terminar con una base más clara, con variables interpretables y lista para análisis exploratorio."
    },
    {
      titulo: "Primer análisis exploratorio sugerido",
      texto: "Después de limpiar, se recomienda partir con tablas, resúmenes y gráficos simples antes de pensar en modelos estadísticos.",
      codigo: `# Algunas ideas iniciales\nsummary(datos)\n\n# Para variables categóricas\n# table(datos$variable_categorica)\n\n# Para variables numéricas\n# hist(datos$variable_numerica)\n# boxplot(datos$variable_numerica ~ datos$grupo)`,
      resultado: `Desde aquí se puede avanzar a: ${analisisSeguros.join(", ") || "análisis exploratorio"}.`
    }
  ];
}


function descargarScriptDesdeFicha(dataset) {
  const contenido = dataset?.script || "# Script pendiente de completar para esta base";
  const nombreBase = (dataset?.id || dataset?.nombre || "codigo_base")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
  const nombreArchivo = `${nombreBase || "codigo_base"}.R`;
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

function DatasetPage({ dataset, onBack }) {
  if (!dataset) {
    return (
      <div>
        <button style={s.buttonAlt} onClick={onBack}>← Volver</button>
        <div style={s.card}>
          <h2>No se encontró la ficha del dataset</h2>
          <p style={{ color: "#475569" }}>Vuelve al catálogo y selecciona nuevamente la base de datos.</p>
        </div>
      </div>
    );
  }

  const guia = Array.isArray(dataset.guiaManual) ? dataset.guiaManual : buildDatasetGuide(dataset);
  const tecnicasSeguras = Array.isArray(dataset.tecnicas) ? dataset.tecnicas : (Array.isArray(dataset.analisis) ? dataset.analisis : []);
  const variablesSeguras = Array.isArray(dataset.variables) ? dataset.variables : [];
  const preguntasSeguras = Array.isArray(dataset.preguntas) ? dataset.preguntas : [];
  const filtrosSeguros = Array.isArray(dataset.sugerenciasFiltros) ? dataset.sugerenciasFiltros : [];
  const pasosProyectoSeguros = Array.isArray(dataset.pasosProyecto) ? dataset.pasosProyecto : [];
  const archivosSeguros = Array.isArray(dataset.archivos) ? dataset.archivos : [];

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>{dataset.area || "Área no especificada"}</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>{dataset.nombre}</h1>
        <p style={s.brandText}>{dataset.contexto || dataset.descripcion}</p>
      </div>
      <div style={s.twoCol}>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Contexto</h2>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>{dataset.contexto || dataset.descripcion}</p>
            <h3>Usos posibles</h3>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>{dataset.usos || "Base útil para iniciar análisis descriptivo, comparación de grupos y construcción de preguntas de investigación."}</p>
            {dataset.notaMetodologica && (
              <div style={{ marginTop: "14px", padding: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", color: "#1e3a8a", lineHeight: 1.65 }}>
                <strong>Nota metodológica:</strong> {dataset.notaMetodologica}
              </div>
            )}
          </div>

          {Array.isArray(dataset.checklistArchivos) && (
            <div style={{ ...s.card, marginTop: "18px" }}>
              <h2 style={{ marginTop: 0 }}>Antes de empezar: archivos que deben estar listos</h2>
              <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>
                Esta ficha usa varios archivos porque incluye datos, script y un mapa HTML. Para que los botones, descargas y la vista previa funcionen, estos archivos deben estar en <code>public/archivos</code> dentro del proyecto de la página.
              </p>
              <ul style={{ color: "#475569", lineHeight: 1.9, paddingLeft: "20px" }}>
                {dataset.checklistArchivos.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Guía paso a paso para comenzar</h2>
            <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>
              Esta sección está pensada para personas que todavía no se manejan mucho con R o estadística.
              La idea es mostrar qué hacer primero, qué código usar y qué debería quedar listo antes del análisis.
            </p>

            {guia.map((paso, index) => (
              <div key={paso.titulo} style={s.stepCard}>
                <div style={s.stepHeader}>
                  <div style={s.stepNumber}>{index + 1}</div>
                  <h3 style={{ margin: 0 }}>{paso.titulo}</h3>
                </div>
                <p style={{ color: "#475569", lineHeight: 1.65, marginBottom: 0 }}>{paso.texto}</p>
                <pre style={s.miniPre}>{paso.codigo}</pre>
                <p style={{ color: "#334155", lineHeight: 1.65, marginBottom: 0 }}>
                  <strong>Qué debería quedar:</strong> {paso.resultado}
                </p>
              </div>
            ))}
          </div>

          {pasosProyectoSeguros.length > 0 && (
            <div style={{ ...s.card, marginTop: "18px" }}>
              <h2 style={{ marginTop: 0 }}>Estructura del proyecto aplicado</h2>
              <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>
                Esta ficha funciona como un proyecto guiado. La idea no es solo cargar datos, sino seguir una secuencia de trabajo para llegar a una base final y a visualizaciones interpretables.
              </p>
              {pasosProyectoSeguros.map((paso) => (
                <div key={paso.titulo} style={s.stepCard}>
                  <h3 style={{ marginTop: 0 }}>{paso.titulo}</h3>
                  <p style={{ color: "#475569", lineHeight: 1.65, marginBottom: 0 }}>{paso.texto}</p>
                </div>
              ))}
            </div>
          )}

          {dataset.mapaInteractivo && (
            <div style={{ ...s.card, marginTop: "18px" }}>
              <h2 style={{ marginTop: 0 }}>Vista previa del mapa interactivo</h2>
              <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>
                Este mapa debe estar guardado como <code>mapa_interactivo_regional_sismos.html</code> dentro de <code>public/archivos</code>. En la vista previa se puede usar dentro de la ficha; para trabajarlo mejor, abre el mapa en pantalla completa.
              </p>
              {dataset.notaMapa && (
                <div style={{ marginBottom: "12px", padding: "12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "12px", color: "#9a3412", lineHeight: 1.65 }}>
                  <strong>Importante:</strong> {dataset.notaMapa}
                </div>
              )}
              <div style={{ marginBottom: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a style={s.button} href={dataset.mapaInteractivo} target="_blank" rel="noreferrer">Abrir mapa en pantalla completa</a>
                {dataset.scriptDescarga && <a style={s.buttonAlt} href={dataset.scriptDescarga} download>Descargar script que genera el mapa</a>}
              </div>
              <iframe
                src={dataset.mapaInteractivo}
                title={`Mapa interactivo ${dataset.nombre}`}
                style={{ width: "100%", height: "660px", border: "1px solid #cbd5e1", borderRadius: "14px", background: "#e2e8f0" }}
              />
            </div>
          )}

          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Código base en R</h2>
            <p style={{ color: "#475569", marginTop: 0, lineHeight: 1.65 }}>
              {dataset.scriptDescarga
                ? "Esta base tiene un script largo. Aquí se muestra una versión resumida y el script completo queda disponible para descargar."
                : "Script completo sugerido para filtrar y preparar la base. Se puede copiar y pegar después de descargar el archivo."}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              <button
                type="button"
                style={s.button}
                onClick={() => descargarScriptDesdeFicha(dataset)}
              >
                Descargar código base en R
              </button>
              {dataset.scriptDescarga && (
                <a style={s.buttonAlt} href={dataset.scriptDescarga} download>Descargar script completo en R</a>
              )}
            </div>
            <pre style={s.pre}>{dataset.script || "# Script pendiente de completar para esta base"}</pre>
          </div>
        </div>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Información del dataset</h2>
            <p><strong>Área:</strong> {dataset.area || "Área no especificada"}</p>
            <p><strong>Fuente:</strong> {dataset.fuenteNombre || "Fuente oficial"}</p>
            <p><strong>Formato:</strong> {dataset.formato || "Archivo de datos"}</p>
            <p><strong>Tamaño:</strong> {dataset.tamano || "No especificado"}</p>
            <p><strong>Unidad de análisis:</strong> {dataset.unidad || "Registros de la base"}</p>
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Técnicas recomendadas</h2>
            {tecnicasSeguras.map((t) => <span key={t} style={s.badge}>{t}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Variables clave</h2>
            {variablesSeguras.map((v) => <span key={v} style={s.badge}>{v}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Preguntas de investigación</h2>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
              {preguntasSeguras.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          {filtrosSeguros.length > 0 && (
            <div style={{ ...s.card, marginTop: "18px" }}>
              <h2 style={{ marginTop: 0 }}>Filtros útiles para adaptar la base</h2>
              <p style={{ color: "#475569", lineHeight: 1.6, marginTop: 0 }}>
                Estas ideas sirven para que cada estudiante pueda acotar la base según su pregunta de investigación.
              </p>
              <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
                {filtrosSeguros.map((p) => <li key={p}><code>{p}</code></li>)}
              </ul>
            </div>
          )}
          <div style={s.linkBox}>
            {archivosSeguros.length > 0 ? (
              <div>
                <p><strong>Archivos disponibles:</strong></p>
                <ul style={{ marginTop: 0, paddingLeft: "20px", lineHeight: 1.9 }}>
                  {archivosSeguros.map((archivo) => (
                    <li key={archivo.url}>
                      <a
                        href={archivo.url}
                        download={archivo.tipo !== "abrir"}
                        target={archivo.tipo === "abrir" ? "_blank" : undefined}
                        rel={archivo.tipo === "abrir" ? "noreferrer" : undefined}
                      >
                        {archivo.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : dataset.descargas ? (
              <p><strong>Archivos de datos:</strong>{" "}
                {dataset.descargas.map((archivo, i) => (
                  <span key={archivo}>
                    <a href={archivo} download>{`Descargar ${i + 1}`}</a>{i < dataset.descargas.length - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            ) : (
              dataset.descarga && <p><strong>Archivo de datos:</strong> <a href={dataset.descarga} download>Descargar archivo</a></p>
            )}
            <p><strong>Fuente original:</strong> <a href={dataset.fuenteOriginal} target="_blank" rel="noreferrer">Abrir sitio oficial</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExercisePage({ exercise, onBack }) {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a ejercicios</button>
      </div>
      <div style={s.heroFormal}>
        <p style={s.eyebrow}>{exercise.tema}</p>
        <h1 style={{ ...s.brandTitle, fontSize: "42px" }}>{exercise.objetivo}</h1>
        <p style={s.brandText}>Base sugerida: {exercise.base}</p>
      </div>
      <div style={s.twoCol}>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Instrucciones paso a paso</h2>
            <ol style={{ color: "#475569", lineHeight: 1.8 }}>
              {exercise.instrucciones.map((i) => <li key={i}>{i}</li>)}
            </ol>
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Código en R</h2>
            <pre style={s.pre}>{exercise.codigo}</pre>
          </div>
        </div>
        <div>
          <div style={s.card}>
            <h2 style={{ marginTop: 0 }}>Objetivo del ejercicio</h2>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>{exercise.objetivo}</p>
            <p><strong>Tema:</strong> {exercise.tema}</p>
            <p><strong>Base sugerida:</strong> {exercise.base}</p>
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
  const [exerciseActual, setExerciseActual] = useState(null);
  const [proyectoActual, setProyectoActual] = useState(null);
  const [origenDataset, setOrigenDataset] = useState("inicio");
  const [busquedaActual, setBusquedaActual] = useState("");

  const aplicarRuta = () => {
    const hash = window.location.hash || "#/inicio";
    const partes = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const vistaRuta = partes[0] || "inicio";

    if (vistaRuta === "catalogo") {
      setVista("catalogo");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "areas") {
      setVista("areas");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "proyectos") {
      setVista("proyectos");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "proyecto") {
      const id = partes[1];
      const proyecto = proyectos.find((p) => p.id === id) || proyectos[0];
      setProyectoActual(proyecto);
      setVista("proyecto");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "area") {
      const area = decodeURIComponent(partes[1] || "");
      setAreaActual(area || areas[0]?.nombre || "");
      setVista("area");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "busqueda") {
      const terminoBusqueda = decodeURIComponent(partes.slice(1).join("/") || "");
      setBusquedaActual(terminoBusqueda);
      setVista("busqueda");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "dataset") {
      const id = partes[1];
      const origen = partes[2] || "inicio";
      const dataset = datasets.find((d) => d.id === id) || datasets[0];
      setDatasetActual(dataset);
      setOrigenDataset(origen);
      setVista("dataset");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    if (vistaRuta === "exercise") {
      const id = partes[1];
      const exercise = ejercicios.find((e) => e.id === id) || ejercicios[0];
      setExerciseActual(exercise);
      setVista("exercise");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
      return;
    }

    setVista("inicio");
    const seccion = partes[1];
    setTimeout(() => {
      if (seccion) {
        document.getElementById(seccion)?.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }, 0);
  };

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/inicio");
    }
    aplicarRuta();
    window.addEventListener("hashchange", aplicarRuta);
    return () => window.removeEventListener("hashchange", aplicarRuta);
  }, []);

  const irA = (ruta) => {
    if (window.location.hash === ruta) {
      aplicarRuta();
    } else {
      window.location.hash = ruta;
    }
  };

  const scrollToSection = (id) => {
    irA(`#/inicio/${id}`);
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Repertorio de Bases de Datos Chilenas</h1>
          <p style={s.headerSubtitle}>Plataforma académica para consulta, descarga y preparación de datos reales.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <GlobalSearch onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)} />
          <nav style={s.nav}>
            <span style={s.navItem} onClick={() => scrollToSection("top")}>Inicio</span>
            <span style={s.navItem} onClick={() => irA("#/catalogo")}>Datasets</span>
            <span style={s.navItem} onClick={() => irA("#/proyectos")}>Proyectos</span>
            <span style={s.navItem} onClick={() => scrollToSection("fuentes")}>Fuentes</span>
          </nav>
        </div>
      </header>

      <main id="top" style={s.mainWrap}>
        {vista === "inicio" && (
          <Home
            onOpenArea={(area) => irA(`#/area/${encodeURIComponent(area)}`)}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
            onOpenExercise={(exercise) => irA(`#/exercise/${exercise.id}`)}
            onOpenCatalog={() => irA("#/catalogo")}
            onOpenAreas={() => irA("#/areas")}
            onOpenProjects={() => irA("#/proyectos")}
            onOpenProject={(proyecto) => irA(`#/proyecto/${proyecto.id}`)}
          />
        )}

        {vista === "catalogo" && (
          <CatalogPage
            onBack={() => irA("#/inicio")}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
          />
        )}

        {vista === "areas" && (
          <AreasListPage
            onBack={() => irA("#/inicio")}
            onOpenArea={(area) => irA(`#/area/${encodeURIComponent(area)}`)}
          />
        )}

        {vista === "proyectos" && (
          <ProjectsPage
            onBack={() => irA("#/inicio")}
            onOpenProject={(proyecto) => irA(`#/proyecto/${proyecto.id}`)}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
          />
        )}

        {vista === "proyecto" && (
          <ProjectPage
            proyecto={proyectoActual}
            onBack={() => irA("#/proyectos")}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
          />
        )}

        {vista === "area" && (
          <AreaPage
            area={areaActual}
            onBack={() => irA("#/areas")}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
          />
        )}

        {vista === "busqueda" && (
          <SearchResultsPage
            query={busquedaActual}
            onBack={() => irA("#/inicio")}
            onOpenDataset={(dataset, origen) => irA(`#/dataset/${dataset.id}/${origen}`)}
          />
        )}

        {vista === "dataset" && (
          <DatasetPage
            dataset={datasetActual}
            onBack={() => {
              if (origenDataset === "area" && areaActual) irA(`#/area/${encodeURIComponent(areaActual)}`);
              else if (origenDataset === "proyectos") irA("#/proyectos");
              else irA("#/inicio");
            }}
          />
        )}

        {vista === "exercise" && (
          <ExercisePage
            exercise={exerciseActual}
            onBack={() => scrollToSection("ejercicios")}
          />
        )}
      </main>
    </div>
  );
}
