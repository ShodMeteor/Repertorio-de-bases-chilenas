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
    unidad: "Postulante / estudiante",
    descripcion:
      "Resultados de estudiantes en Matemática, Competencia Lectora, NEM, Ranking y variables del establecimiento.",
    contexto:
      "La base PAES permite trabajar con información asociada al proceso de admisión universitaria en Chile. Incluye puntajes de pruebas, antecedentes escolares y variables relacionadas con el establecimiento de origen. Es útil para estudiar diferencias de rendimiento entre tipos de colegio, regiones y grupos de estudiantes, además de explorar relaciones entre notas de enseñanza media, ranking y puntajes en pruebas estandarizadas.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de grupos, pruebas de hipótesis, análisis regional, correlación entre puntajes y modelos de regresión simples.",
    tecnicas: [
      "Histogramas",
      "Boxplots por tipo de colegio",
      "Gráficos de dispersión",
      "t-test",
      "ANOVA regional",
      "Correlación",
    ],
    preguntas: [
      "¿Existen diferencias entre colegios municipales y particulares pagados?",
      "¿Existen diferencias regionales en los puntajes?",
      "¿Qué relación hay entre NEM, ranking y puntajes PAES?",
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
    script: `datos <- read.csv("ArchivoC_Adm2025.csv",
                  sep = ";",
                  stringsAsFactors = FALSE)

datos_filtro <- subset(datos,
                       GRUPO_DEPENDENCIA %in% c(1, 3) &
                       SITUACION_EGRESO %in% c(1, 2, 3, 4))

datos_filtro$tipo_colegio <- ifelse(datos_filtro$GRUPO_DEPENDENCIA == 1,
                                    "Municipal",
                                    "Particular_Pagado")

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

datos_final <- subset(datos_final,
                      CLEC_REG_ACTUAL > 0 &
                      MATE1_REG_ACTUAL > 0)

datos_final$PROMEDIO_NOTAS <- gsub(",", ".", datos_final$PROMEDIO_NOTAS)
datos_final$PROMEDIO_NOTAS <- as.numeric(datos_final$PROMEDIO_NOTAS)

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
      "La base SIMCE 2° medio 2024 entrega resultados agregados a nivel de establecimiento educacional. Permite analizar puntajes promedio en Matemática y Lectura, junto con variables de ubicación y dependencia administrativa. Es especialmente útil para trabajar comparaciones entre tipos de establecimientos, comunas o regiones, y para estudiar la relación entre desempeño en distintas áreas evaluadas.",
    usos:
      "Puede usarse para análisis descriptivo, boxplots por dependencia, comparación de medias, ANOVA, análisis regional y correlación entre puntajes de Matemática y Lectura.",
    tecnicas: [
      "Boxplots por tipo de establecimiento",
      "Boxplots por región",
      "Histogramas",
      "Dispersión Lectura vs Matemática",
      "Correlación",
      "ANOVA",
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
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

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

datos_simce$cod_reg_rbd <- factor(datos_simce$cod_reg_rbd)
datos_simce$cod_com_rbd <- factor(datos_simce$cod_com_rbd)

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
    analisis: ["Exploratorio", "Regresión", "Regresión logística", "Correlación"],
    fuenteNombre: "Observatorio Social",
    unidad: "Persona / hogar",
    descripcion:
      "Encuesta socioeconómica con variables de ingreso, escolaridad, pobreza, salud, asistencia escolar y territorio.",
    contexto:
      "CASEN 2024 es una de las principales fuentes para estudiar condiciones sociales y económicas en Chile. Permite trabajar con variables de personas y hogares, incluyendo edad, sexo, región, zona urbana o rural, escolaridad, ingresos, pobreza por ingresos, pobreza multidimensional y variables relacionadas con acceso a salud. En el repertorio se deja una selección amplia para que pueda usarse en educación, desigualdad, salud y análisis territorial.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de grupos, regresión lineal, regresión logística, análisis de pobreza, relación entre escolaridad e ingreso, acceso a salud y diferencias regionales.",
    tecnicas: [
      "Histogramas",
      "Boxplots por pobreza",
      "Gráficos de dispersión",
      "Correlación",
      "Regresión lineal",
      "Regresión logística",
    ],
    preguntas: [
      "¿Existe relación entre escolaridad e ingreso?",
      "¿Las personas en pobreza tienen menor escolaridad?",
      "¿Existen diferencias regionales en ingreso o acceso a salud?",
      "¿Qué variables se asocian con problemas para conseguir atención médica?",
    ],
    variables: [
      "edad",
      "sexo",
      "region",
      "area",
      "esc",
      "ytot",
      "pobreza",
      "pobreza_multi",
      "asiste",
      "desercion",
      "hh_d_acc",
      "s19b",
      "s19d",
      "s19e",
      "nse",
    ],
    fuenteOriginal:
      "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    script: `load("casen_2024")

datos_casen <- casen_2024

casen <- datos_casen[, c(
  "edad",
  "sexo",
  "region",
  "area",
  "esc",
  "ytot",
  "pobreza",
  "pobreza_multi",
  "asiste",
  "desercion",
  "hh_d_acc",
  "s19b",
  "s19d",
  "s19e",
  "nse"
)]

codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)

for (v in names(casen)) {
  casen[[v]][casen[[v]] %in% codigos_invalidos] <- NA
}

casen <- subset(casen,
                !is.na(edad) &
                !is.na(sexo) &
                !is.na(region) &
                !is.na(area))

casen_15 <- subset(casen,
                   edad >= 15 &
                   !is.na(esc) &
                   !is.na(ytot))

casen_15 <- subset(casen_15,
                   esc >= 0 &
                   ytot >= 0)

casen_15$log_ytot <- log1p(casen_15$ytot)

casen_15$rm_o_r <- ifelse(casen_15$region == 13,
                          "Metropolitana",
                          "Regiones")

casen_15$problema_hora <- ifelse(casen_15$s19b == 1, 1,
                                 ifelse(casen_15$s19b == 2, 0, NA))

casen_15$sexo <- factor(casen_15$sexo)
casen_15$region <- factor(casen_15$region)
casen_15$area <- factor(casen_15$area)
casen_15$pobreza <- factor(casen_15$pobreza)
casen_15$pobreza_multi <- factor(casen_15$pobreza_multi)
casen_15$asiste <- factor(casen_15$asiste)
casen_15$desercion <- factor(casen_15$desercion)
casen_15$hh_d_acc <- factor(casen_15$hh_d_acc)
casen_15$nse <- factor(casen_15$nse)
casen_15$rm_o_r <- factor(casen_15$rm_o_r)

head(casen_15)
summary(casen_15)`,
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

if ("X" %in% names(datos)) {
  datos$X <- NULL
}

datos$fecha <- trimws(as.character(datos$fecha))
datos$fecha <- gsub("[^0-9]", "", datos$fecha)

limpiar_numerica <- function(x) {
  x <- trimws(as.character(x))
  x[x == ""] <- NA
  x <- gsub(",", ".", x)
  x <- gsub("[^0-9.-]", "", x)
  as.numeric(x)
}

datos$reg_validos <- limpiar_numerica(datos$reg_validos)
datos$fecha_mes <- as.Date(datos$fecha, format = "%y%m%d")

datos_validos <- subset(datos,
                        !is.na(fecha_mes) &
                        !is.na(reg_validos))

datos_validos$anio <- format(datos_validos$fecha_mes, "%Y")
datos_validos$mes_num <- format(datos_validos$fecha_mes, "%m")

datos_validos$mes <- factor(
  datos_validos$mes_num,
  levels = c("01","02","03","04","05","06","07","08","09","10","11","12"),
  labels = c("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic")
)

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
    tecnicas: [
      "Tablas de frecuencia",
      "Histogramas",
      "Boxplots por región",
      "ANOVA",
      "Regresión lineal",
      "Regresión logística",
    ],
    preguntas: [
      "¿Existen diferencias en los días de estadía según región?",
      "¿Los días de estadía cambian según previsión de salud?",
      "¿La probabilidad de intervención quirúrgica cambia según sexo o grupo de edad?",
      "¿Qué diagnósticos aparecen con mayor frecuencia?",
    ],
    variables: [
      "SEXO",
      "GRUPO_EDAD",
      "GLOSA_REGION_RESIDENCIA",
      "GLOSA_COMUNA_RESIDENCIA",
      "GLOSA_PREVISION",
      "ANO_EGRESO",
      "DIAG1",
      "DIAS_ESTADA",
      "CONDICION_EGRESO",
      "INTERV_Q",
    ],
    descarga: "",
    fuenteOriginal: "https://deis.minsal.cl/#datos-abiertos",
    script: `datos <- read.csv("EGRE_DATOS_ABIERTOS_2020.csv",
                  sep = ";",
                  encoding = "latin1",
                  stringsAsFactors = FALSE)

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

colSums(is.na(egresos))

egresos <- subset(egresos,
                  !is.na(SEXO) &
                  !is.na(GRUPO_EDAD) &
                  !is.na(GLOSA_REGION_RESIDENCIA) &
                  !is.na(DIAG1) &
                  !is.na(DIAS_ESTADA))

egresos <- subset(egresos, DIAS_ESTADA >= 0)

egresos$diag_capitulo <- substr(egresos$DIAG1, 1, 1)

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
      "Esta base permite estudiar mortalidad de forma agregada por semana epidemiológica. A diferencia de una base individual, cada fila resume un grupo definido por año, semana, sexo, edad y región. Es útil para observar evolución temporal básica, diferencias territoriales y tasas de mortalidad usando población como denominador.",
    usos:
      "Puede utilizarse para análisis temporal básico, cálculo de tasas, comparación por región, comparación por grupo etario y regresión lineal simple para observar tendencias.",
    tecnicas: [
      "Tablas por región",
      "Gráficos por semana",
      "Tasas por 100.000 habitantes",
      "Boxplots por año",
      "Regresión lineal",
    ],
    preguntas: [
      "¿Qué regiones presentan mayor tasa de mortalidad?",
      "¿Cómo cambian las defunciones por semana epidemiológica?",
      "¿Existen diferencias por grupo de edad o sexo?",
      "¿La tasa de mortalidad cambia entre años?",
    ],
    variables: [
      "ANO_ESTADISTICO",
      "SEMANA_ESTADISTICA",
      "GRUPO_EDAD",
      "SEXO",
      "REGION",
      "POBLACION",
      "MUERTES_OBS",
      "tasa_mortalidad",
    ],
    descarga: "/archivos/def_semana_epidemiologica.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("def_semana_epidemiologica.csv",
                  sep = "|",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE)

defunciones <- datos[, c(
  "ANO_ESTADISTICO",
  "SEMANA_ESTADISTICA",
  "GRUPO_EDAD",
  "SEXO",
  "REGION",
  "POBLACION",
  "MUERTES_OBS"
)]

colSums(is.na(defunciones))

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

defunciones$tasa_mortalidad <- (defunciones$MUERTES_OBS / defunciones$POBLACION) * 100000

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
    tecnicas: [
      "Tablas de contingencia",
      "Gráficos de barras",
      "Boxplots de horas",
      "Comparación de proporciones",
      "Regresión logística",
      "ANOVA",
    ],
    preguntas: [
      "¿Existen diferencias en ocupación entre hombres y mujeres?",
      "¿La informalidad laboral cambia según región?",
      "¿Las horas trabajadas varían según categoría ocupacional?",
      "¿La probabilidad de estar ocupado cambia según edad, sexo o educación?",
    ],
    variables: [
      "ano_trimestre",
      "mes_central",
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
      "fact_cal",
    ],
    descarga: "/archivos/ene-2026-02-efm.csv",
    fuenteOriginal: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral",
    script: `datos <- read.csv("ene-2026-02-efm.csv",
                  sep = ";",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE)

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

colSums(is.na(ene))

ene$fact_cal <- gsub(",", ".", ene$fact_cal)
ene$fact_cal <- as.numeric(ene$fact_cal)

ene$habituales <- as.numeric(ene$habituales)
ene$efectivas <- as.numeric(ene$efectivas)

ene <- subset(ene,
              !is.na(edad) &
              edad >= 15)

ene <- subset(ene,
              !is.na(region) &
              !is.na(sexo) &
              !is.na(activ))

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
    tecnicas: [
      "Gráficos temporales",
      "Boxplots por región",
      "Comparación por trimestre",
      "Regresión lineal",
      "ANOVA",
    ],
    preguntas: [
      "¿Qué regiones tienen mayor PIB trimestral?",
      "¿Cómo ha evolucionado el PIB regional entre 2013 y 2025?",
      "¿Existen diferencias promedio entre regiones?",
      "¿Qué regiones muestran mayor crecimiento?",
    ],
    variables: [
      "region",
      "fecha",
      "pib",
      "anio",
      "trimestre",
    ],
    descarga: "/archivos/CCNN2018_PIB_REGIONAL_T.xlsx",
    fuenteOriginal: "https://si3.bcentral.cl/Siete",
    script: `library(readxl)
library(dplyr)
library(tidyr)

datos <- read_excel("CCNN2018_PIB_REGIONAL_T.xlsx")

names(datos)
head(datos)

names(datos)[1] <- "region"

pib_regional <- datos %>%
  pivot_longer(
    cols = -region,
    names_to = "periodo",
    values_to = "pib"
  )

pib_regional$region <- trimws(as.character(pib_regional$region))
pib_regional$pib <- as.numeric(pib_regional$pib)

pib_regional <- subset(pib_regional,
                       !is.na(region) &
                       !is.na(periodo) &
                       !is.na(pib))

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
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Análisis temporal básico"],
    fuenteNombre: "MINSAL / DEIS",
    unidad: "Establecimiento-área funcional-mes",
    descripcion:
      "Indicadores hospitalarios mensuales por establecimiento y área funcional, incluyendo camas, egresos, días de estadía, letalidad e índice ocupacional.",
    contexto:
      "Esta base permite estudiar el funcionamiento hospitalario a partir de indicadores agregados por establecimiento, servicio de salud, área funcional y mes. Es útil para analizar ocupación de camas, egresos, días de estadía, letalidad y rotación. Al estar organizada de forma mensual, también permite hacer análisis temporal básico sin entrar directamente en modelos de series de tiempo.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación entre establecimientos, comparación entre áreas funcionales, ANOVA, regresión lineal y gráficos temporales por mes o año.",
    tecnicas: [
      "Tablas descriptivas",
      "Boxplots por área funcional",
      "Gráficos por mes",
      "ANOVA",
      "Regresión lineal",
      "Análisis temporal básico",
    ],
    preguntas: [
      "¿Qué áreas funcionales presentan mayor promedio de días de estadía?",
      "¿Existen diferencias en el índice ocupacional entre servicios de salud?",
      "¿Cómo evoluciona el número de egresos por mes?",
      "¿La letalidad varía según área funcional o establecimiento?",
    ],
    variables: [
      "PERIODO",
      "GLOSA_SSS",
      "ESTABLECIMIENTO",
      "AREA_FUNCIONAL",
      "MES",
      "DIAS_CAMAS_OCUPADAS",
      "DIAS_CAMAS_DISPONIBLES",
      "DIAS_ESTADA",
      "NUMERO_EGRESOS",
      "EGRESOS_FALLECIDOS",
      "INDICE_OCUPACIONAL",
      "PROMEDIO_DIAS_ESTADA",
      "LETALIDAD",
    ],
    descarga: "/archivos/indicadores_rem20_20260425.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("indicadores_rem20_20260425.csv",
                  sep = ";",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE)

# Seleccionar variables principales para comenzar el análisis
rem20 <- datos[, c(
  "PERIODO",
  "GLOSA_SSS",
  "CODIGO_ESTABLECIMIENTO",
  "ESTABLECIMIENTO",
  "AREA_FUNCIONAL",
  "MES",
  "DIAS_CAMAS_OCUPADAS",
  "DIAS_CAMAS_DISPONIBLES",
  "DIAS_ESTADA",
  "NUMERO_EGRESOS",
  "EGRESOS_FALLECIDOS",
  "INDICE_OCUPACIONAL",
  "PROMEDIO_CAMAS_DISPONIBLE",
  "PROMEDIO_DIAS_ESTADA",
  "LETALIDAD",
  "INDICE_ROTACION"
)]

# Función para transformar variables numéricas que puedan venir como texto
limpiar_numero <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x[x == ""] <- NA
  as.numeric(x)
}

# Convertir variables numéricas
vars_num <- c("DIAS_CAMAS_OCUPADAS", "DIAS_CAMAS_DISPONIBLES", "DIAS_ESTADA",
              "NUMERO_EGRESOS", "EGRESOS_FALLECIDOS", "INDICE_OCUPACIONAL",
              "PROMEDIO_CAMAS_DISPONIBLE", "PROMEDIO_DIAS_ESTADA",
              "LETALIDAD", "INDICE_ROTACION")

for (v in vars_num) {
  rem20[[v]] <- limpiar_numero(rem20[[v]])
}

# Filtrar filas con información básica válida
rem20 <- subset(rem20,
                !is.na(PERIODO) &
                !is.na(MES) &
                !is.na(ESTABLECIMIENTO) &
                !is.na(AREA_FUNCIONAL) &
                !is.na(NUMERO_EGRESOS))

# Filtrar valores coherentes
rem20 <- subset(rem20,
                MES >= 1 & MES <= 12 &
                NUMERO_EGRESOS >= 0 &
                DIAS_ESTADA >= 0)

# Crear fecha mensual aproximada
rem20$fecha_mes <- as.Date(paste(rem20$PERIODO, rem20$MES, "01", sep = "-"))

# Convertir variables categóricas
rem20$GLOSA_SSS <- factor(rem20$GLOSA_SSS)
rem20$ESTABLECIMIENTO <- factor(rem20$ESTABLECIMIENTO)
rem20$AREA_FUNCIONAL <- factor(rem20$AREA_FUNCIONAL)
rem20$MES <- factor(rem20$MES)

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
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal", "Análisis temporal básico"],
    fuenteNombre: "ODEPA",
    unidad: "Registro de precio por producto-mercado-fecha",
    descripcion:
      "Precios mayoristas de frutas, hortalizas y tubérculos por fecha, región, mercado, producto, variedad, calidad, origen, volumen y precio.",
    contexto:
      "Esta base permite estudiar el comportamiento de precios mayoristas agrícolas en Chile durante 2026. Es útil para comparar productos, mercados, regiones y fechas, además de analizar la variabilidad del precio promedio según producto, origen o calidad. También permite trabajar con datos reales de precios, donde aparecen variables numéricas, categóricas y temporales.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de precios por producto o región, ANOVA, regresión lineal simple y análisis temporal básico por fecha.",
    tecnicas: [
      "Tablas por producto",
      "Boxplots por región",
      "Gráficos temporales",
      "ANOVA",
      "Regresión lineal",
    ],
    preguntas: [
      "¿Qué productos presentan mayor precio promedio?",
      "¿Existen diferencias de precios entre regiones o mercados?",
      "¿El volumen comercializado se relaciona con el precio promedio?",
      "¿Cómo cambia el precio de un producto durante el año?",
    ],
    variables: [
      "Fecha",
      "Region",
      "Mercado",
      "Subsector",
      "Producto",
      "Variedad / Tipo",
      "Calidad",
      "Origen",
      "Volumen",
      "Precio minimo",
      "Precio maximo",
      "Precio promedio",
    ],
    descarga: "/archivos/precio_mayorista_fruta-hortaliza_2026.csv",
    fuenteOriginal: "https://www.odepa.gob.cl/precios",
    script: `datos <- read.csv("precio_mayorista_fruta-hortaliza_2026.csv",
                  sep = ",",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE,
                  check.names = FALSE)

# Seleccionar variables principales
precios <- datos[, c(
  "Fecha",
  "ID region",
  "Region",
  "Mercado",
  "Subsector",
  "Producto",
  "Variedad / Tipo",
  "Calidad",
  "Unidad de comercializacion",
  "Origen",
  "Volumen",
  "Precio minimo",
  "Precio maximo",
  "Precio promedio"
)]

# Función para limpiar números con coma decimal
limpiar_numero <- function(x) {
  x <- as.character(x)
  x <- gsub("\\.", "", x)
  x <- gsub(",", ".", x)
  x[x == ""] <- NA
  as.numeric(x)
}

# Transformar fecha y variables numéricas
precios$Fecha <- as.Date(precios$Fecha)
precios$Volumen <- limpiar_numero(precios$Volumen)
precios$precio_minimo <- limpiar_numero(precios[["Precio minimo"]])
precios$precio_maximo <- limpiar_numero(precios[["Precio maximo"]])
precios$precio_promedio <- limpiar_numero(precios[["Precio promedio"]])

# Filtrar datos válidos
precios <- subset(precios,
                  !is.na(Fecha) &
                  !is.na(Region) &
                  !is.na(Mercado) &
                  !is.na(Producto) &
                  !is.na(precio_promedio) &
                  precio_promedio >= 0)

# Crear variables temporales
precios$anio <- format(precios$Fecha, "%Y")
precios$mes <- format(precios$Fecha, "%m")

# Convertir variables categóricas
precios$Region <- factor(precios$Region)
precios$Mercado <- factor(precios$Mercado)
precios$Subsector <- factor(precios$Subsector)
precios$Producto <- factor(precios$Producto)
precios$Calidad <- factor(precios$Calidad)
precios$Origen <- factor(precios$Origen)
precios$mes <- factor(precios$mes)

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
    fuenteNombre: "ODEPA",
    unidad: "Registro de precio por variedad-comuna-fecha",
    descripcion:
      "Precios de uva de vinificación por región, comuna, poder comprador, variedad, precio y grado brix.",
    contexto:
      "Esta base es más específica que la de precios mayoristas, pero sirve para trabajar con un caso agrícola concreto. Permite comparar precios de uva de vinificación según región, comuna, variedad y poder comprador. También permite estudiar la relación entre grado brix y precio, lo que puede motivar ejercicios de regresión lineal simple.",
    usos:
      "Puede utilizarse para análisis exploratorio, comparación de precios por variedad, ANOVA por región o variedad y regresión lineal entre grado brix y precio.",
    tecnicas: [
      "Tablas por variedad",
      "Boxplots por región",
      "Boxplots por variedad",
      "ANOVA",
      "Regresión lineal",
    ],
    preguntas: [
      "¿Qué variedades tienen mayor precio promedio?",
      "¿Existen diferencias de precio entre regiones o comunas?",
      "¿El grado brix se relaciona con el precio?",
      "¿Qué poder comprador registra mayores precios?",
    ],
    variables: [
      "Anio",
      "Mes",
      "Fecha precio vigente",
      "Region",
      "Comuna",
      "Poder comprador",
      "Variedad",
      "Precio",
      "Grado brix",
    ],
    descarga: "/archivos/precio_uva_vinificacion_2026.csv",
    fuenteOriginal: "https://www.odepa.gob.cl/precios",
    script: `datos <- read.csv("precio_uva_vinificacion_2026.csv",
                  sep = ",",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE,
                  check.names = FALSE)

# Seleccionar variables principales
uva <- datos[, c(
  "Anio",
  "Mes",
  "Fecha precio vigente",
  "ID region",
  "Region",
  "Comuna",
  "Poder comprador",
  "Variedad",
  "Precio",
  "Grado brix"
)]

# Función para limpiar números
limpiar_numero <- function(x) {
  x <- as.character(x)
  x <- gsub(",", ".", x)
  x[x == ""] <- NA
  as.numeric(x)
}

# Transformar variables
uva$fecha <- as.Date(uva[["Fecha precio vigente"]])
uva$precio <- limpiar_numero(uva$Precio)
uva$grado_brix <- limpiar_numero(uva[["Grado brix"]])

# Filtrar registros válidos
uva <- subset(uva,
              !is.na(fecha) &
              !is.na(Region) &
              !is.na(Comuna) &
              !is.na(Variedad) &
              !is.na(precio) &
              precio >= 0)

# Convertir variables categóricas
uva$Region <- factor(uva$Region)
uva$Comuna <- factor(uva$Comuna)
uva[["Poder comprador"]] <- factor(uva[["Poder comprador"]])
uva$Variedad <- factor(uva$Variedad)
uva$Mes <- factor(uva$Mes)

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
    analisis: ["Exploratorio", "ANOVA", "Análisis temporal básico", "Regresión lineal"],
    fuenteNombre: "Dirección Meteorológica de Chile / Datos.gob.cl",
    unidad: "Estación-día",
    descripcion:
      "Temperaturas mínimas y máximas diarias registradas por estaciones meteorológicas durante 2012.",
    contexto:
      "Esta base permite estudiar temperaturas diarias por estación meteorológica. Incluye ubicación de la estación, fecha y temperaturas mínima y máxima. Es útil para comparar estaciones, meses o zonas, además de trabajar con variables temporales simples sin necesidad de entrar en series de tiempo avanzadas.",
    usos:
      "Puede utilizarse para histogramas de temperatura, boxplots por mes o estación, comparación entre estaciones, ANOVA y regresión lineal simple entre temperatura mínima y máxima.",
    tecnicas: [
      "Histogramas",
      "Boxplots por mes",
      "Boxplots por estación",
      "ANOVA",
      "Regresión lineal",
      "Análisis temporal básico",
    ],
    preguntas: [
      "¿Qué estaciones presentan mayores temperaturas máximas?",
      "¿Existen diferencias de temperatura entre meses?",
      "¿Qué relación hay entre temperatura mínima y máxima?",
      "¿Cómo cambia la temperatura durante el año?",
    ],
    variables: [
      "IdEstacion",
      "Nombre Estacion",
      "Latitud",
      "Longitud",
      "Altura",
      "Año",
      "Mes",
      "Dia",
      "TMinima",
      "TMaxima",
      "fecha",
    ],
    descarga: "/archivos/temperaturasDiariasPorEstaciones2012.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("temperaturasDiariasPorEstaciones2012.csv",
                  sep = ";",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE,
                  check.names = FALSE)

# Seleccionar variables principales
temperaturas <- datos[, c(
  "IdEstacion",
  "Nombre Estacion",
  "Latitud",
  "Longitud",
  "Altura",
  "Año",
  "Mes",
  "Dia",
  "TMinima",
  "TMaxima"
)]

# Convertir variables numéricas
temperaturas$TMinima <- as.numeric(temperaturas$TMinima)
temperaturas$TMaxima <- as.numeric(temperaturas$TMaxima)
temperaturas$Altura <- as.numeric(temperaturas$Altura)

# Crear fecha
temperaturas$fecha <- as.Date(paste(temperaturas$Año, temperaturas$Mes, temperaturas$Dia, sep = "-"))

# Filtrar registros válidos
temperaturas <- subset(temperaturas,
                       !is.na(fecha) &
                       !is.na(temperaturas[["Nombre Estacion"]]) &
                       !is.na(TMinima) &
                       !is.na(TMaxima))

# Filtrar valores coherentes generales
temperaturas <- subset(temperaturas,
                       TMinima > -50 & TMinima < 60 &
                       TMaxima > -50 & TMaxima < 60 &
                       TMaxima >= TMinima)

# Crear variables temporales
temperaturas$mes <- factor(temperaturas$Mes,
                           levels = 1:12,
                           labels = c("Ene", "Feb", "Mar", "Abr", "May", "Jun",
                                      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"))

temperaturas[["Nombre Estacion"]] <- factor(temperaturas[["Nombre Estacion"]])

head(temperaturas)
summary(temperaturas)`,
  },

  {
    id: "ruea-emisiones-transporte-2024",
    nombre: "Emisiones de transporte 2024",
    area: "Medio ambiente",
    icono: "🚗",
    formato: "CSV",
    tamano: "Mediana",
    analisis: ["Exploratorio", "ANOVA", "Regresión lineal"],
    fuenteNombre: "MMA / Datos.gob.cl",
    unidad: "Comuna-contaminante-tipo de vehículo",
    descripcion:
      "Emisiones del transporte por comuna, ciudad, contaminante, tipo de vehículo, tipo de emisión y toneladas emitidas.",
    contexto:
      "Esta base permite estudiar emisiones asociadas al transporte en Chile. Incluye información por comuna, ciudad, contaminante, tipo de vehículo y tipo de emisión. Es útil para comparar qué ciudades o tipos de vehículos concentran mayores emisiones, y para trabajar preguntas ambientales con datos agregados.",
    usos:
      "Puede utilizarse para análisis exploratorio, ranking de emisiones por ciudad, comparación por contaminante, ANOVA por tipo de vehículo y regresión lineal simple con toneladas emitidas.",
    tecnicas: [
      "Tablas por ciudad",
      "Gráficos de barras",
      "Boxplots por tipo de vehículo",
      "ANOVA",
      "Regresión lineal",
    ],
    preguntas: [
      "¿Qué ciudades presentan mayores emisiones de transporte?",
      "¿Qué contaminantes concentran más toneladas emitidas?",
      "¿Existen diferencias por tipo de vehículo?",
      "¿Qué tipo de emisión es más relevante según contaminante?",
    ],
    variables: [
      "id_comuna",
      "año",
      "cantidad_toneladas",
      "contaminantes",
      "tipo_vehiculo",
      "tipo_emision",
      "ciudad",
    ],
    descarga: "/archivos/ruea-tr-2024-ckan_mejora.csv",
    fuenteOriginal: "https://datos.gob.cl",
    script: `datos <- read.csv("ruea-tr-2024-ckan_mejora.csv",
                  sep = ";",
                  encoding = "UTF-8",
                  stringsAsFactors = FALSE,
                  check.names = FALSE)

# Seleccionar variables principales
emisiones <- datos[, c(
  "id_comuna",
  "año",
  "cantidad_toneladas",
  "id_contaminantes",
  "contaminantes",
  "tipo_vehiculo",
  "tipo_emision",
  "ciudad"
)]

# Limpiar toneladas emitidas
emisiones$cantidad_toneladas <- as.character(emisiones$cantidad_toneladas)
emisiones$cantidad_toneladas <- gsub(",", ".", emisiones$cantidad_toneladas)
emisiones$cantidad_toneladas <- as.numeric(emisiones$cantidad_toneladas)

# Filtrar registros válidos
emisiones <- subset(emisiones,
                    !is.na(ciudad) &
                    !is.na(contaminantes) &
                    !is.na(tipo_vehiculo) &
                    !is.na(tipo_emision) &
                    !is.na(cantidad_toneladas) &
                    cantidad_toneladas >= 0)

# Convertir variables categóricas
emisiones$ciudad <- factor(emisiones$ciudad)
emisiones$contaminantes <- factor(emisiones$contaminantes)
emisiones$tipo_vehiculo <- factor(emisiones$tipo_vehiculo)
emisiones$tipo_emision <- factor(emisiones$tipo_emision)
emisiones$año <- factor(emisiones$año)

head(emisiones)
summary(emisiones)`,
  }
];


const areas = [
  { nombre: "Educación", icono: "🎓", descripcion: "Bases para rendimiento académico y contexto escolar.", color: "#1d4ed8" },
  { nombre: "Datos sociales", icono: "📊", descripcion: "Bases para ingreso, pobreza, escolaridad, salud y desigualdad.", color: "#047857" },
  { nombre: "Salud", icono: "🏥", descripcion: "Bases para egresos hospitalarios, mortalidad e indicadores del sistema de salud.", color: "#be123c" },
  { nombre: "Trabajo", icono: "💼", descripcion: "Bases para ocupación, desocupación, informalidad y condiciones laborales.", color: "#7c3aed" },
  { nombre: "Economía", icono: "💰", descripcion: "Bases para PIB regional, actividad económica e indicadores macroeconómicos.", color: "#b45309" },
  { nombre: "Agricultura", icono: "🍎", descripcion: "Bases para precios agrícolas, productos, mercados y comparación regional.", color: "#ca8a04" },
  { nombre: "Medio ambiente", icono: "🌱", descripcion: "Bases para calidad del aire, clima, temperaturas y emisiones ambientales.", color: "#15803d" },
];

const fuentes = [
  { nombre: "Agencia de Calidad de la Educación", descripcion: "Bases educativas oficiales.", url: "https://informacionestadistica.agenciaeducacion.cl/#/bases" },
  { nombre: "Observatorio Social", descripcion: "Información oficial de CASEN.", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024" },
  { nombre: "DEIS / MINSAL", descripcion: "Datos abiertos de salud, como egresos hospitalarios y estadísticas sanitarias.", url: "https://deis.minsal.cl/#datos-abiertos" },
  { nombre: "Datos.gob.cl", descripcion: "Portal de datos abiertos del Estado, incluyendo salud, clima y medio ambiente.", url: "https://datos.gob.cl" },
  { nombre: "INE", descripcion: "Bases estadísticas oficiales, incluyendo Encuesta Nacional de Empleo.", url: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral" },
  { nombre: "Banco Central de Chile", descripcion: "Base de Datos Estadísticos con indicadores macroeconómicos y PIB regional.", url: "https://si3.bcentral.cl/Siete" },
  { nombre: "ODEPA", descripcion: "Información de precios agrícolas, frutas, hortalizas y productos vitivinícolas.", url: "https://www.odepa.gob.cl/precios" },
  { nombre: "SINCA", descripcion: "Sistema de Información Nacional de Calidad del Aire.", url: "https://sinca.mma.gob.cl/index.php/" },
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
    codigo: `load("casen_2024")

datos <- casen_2024[, c("esc", "ytot")]

datos <- subset(datos,
                !is.na(esc) &
                !is.na(ytot) &
                esc >= 0 &
                ytot > 0)

modelo <- lm(ytot ~ esc, data = datos)

summary(modelo)

plot(datos$esc, datos$ytot,
     xlab = "Años de escolaridad",
     ylab = "Ingreso total")

abline(modelo)`,
  },
];

const filtrosDisponibles = {
  tamano: ["Pequeña", "Mediana", "Grande"],
  analisis: ["Exploratorio", "t-test", "ANOVA", "Regresión", "Correlación", "Análisis temporal básico"],
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
};

function Home({ onOpenArea, onOpenDataset, onOpenExercise }) {
  const [busquedaHome, setBusquedaHome] = useState("");

  const resultadosBusqueda = useMemo(() => {
    if (!busquedaHome.trim()) return datasets;
    return datasets.filter((d) =>
      [d.nombre, d.area, d.descripcion, d.contexto, d.fuenteNombre, d.formato, ...d.variables, ...d.tecnicas, ...d.preguntas]
        .join(" ")
        .toLowerCase()
        .includes(busquedaHome.toLowerCase())
    );
  }, [busquedaHome]);

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

        <input
          style={s.searchBox}
          placeholder="Buscar por nombre, área, fuente, variable o técnica..."
          value={busquedaHome}
          onChange={(e) => setBusquedaHome(e.target.value)}
        />

        <div style={s.statsGrid}>
          <div style={s.statCard}><p style={s.statNumber}>{datasets.length}</p><p style={s.statLabel}>datasets incorporados</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{areas.length}</p><p style={s.statLabel}>áreas temáticas</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{fuentes.length}</p><p style={s.statLabel}>fuentes oficiales</p></div>
          <div style={s.statCard}><p style={s.statNumber}>{ejercicios.length}</p><p style={s.statLabel}>ejercicios sugeridos</p></div>
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

      <h2 id="datasets" style={{ ...s.title, marginTop: "40px" }}>
        {busquedaHome.trim() ? "Resultados de búsqueda" : "Datasets destacados"}
      </h2>
      <p style={s.sectionSubtitle}>
        {busquedaHome.trim() ? `Se encontraron ${resultadosBusqueda.length} resultado(s).` : "Bases incorporadas actualmente al repertorio."}
      </p>

      <div style={s.grid}>
        {resultadosBusqueda.map((d) => (
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
        ))}
      </div>

      <h2 id="ejercicios" style={{ ...s.title, marginTop: "40px" }}>Ejercicios sugeridos</h2>
      <p style={s.sectionSubtitle}>Ejercicios organizados por tema. Cada uno puede abrirse como guía completa.</p>
      <div style={s.grid}>
        {ejercicios.map((e) => (
          <div key={e.id} style={s.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={s.iconBox}>{e.icono}</div>
              <h3 style={{ margin: 0 }}>{e.tema}</h3>
            </div>
            <p style={s.smallMuted}>{e.objetivo}</p>
            <button style={s.button} onClick={() => onOpenExercise(e)}>Ver ejercicio completo</button>
          </div>
        ))}
      </div>

      <h2 id="areas" style={{ ...s.title, marginTop: "40px" }}>Explorar por área</h2>
      <p style={s.sectionSubtitle}>Entra a una categoría específica para filtrar bases según tamaño o técnica principal.</p>
      <div style={s.grid}>
        {areas.map((area) => (
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

      <h2 id="fuentes" style={{ ...s.title, marginTop: "40px" }}>Fuentes oficiales</h2>
      <p style={s.sectionSubtitle}>Sitios desde donde provienen las bases incorporadas en el repertorio.</p>
      <div style={s.grid}>
        {fuentes.map((fuente) => (
          <div key={fuente.nombre} style={s.card}>
            <h3 style={{ marginTop: 0 }}>{fuente.nombre}</h3>
            <p style={s.smallMuted}>{fuente.descripcion}</p>
            <a href={fuente.url} target="_blank" rel="noreferrer">Abrir fuente oficial</a>
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
        return [d.nombre, d.descripcion, d.contexto, d.fuenteNombre, d.formato, ...d.variables, ...d.tecnicas, ...d.preguntas]
          .join(" ")
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      })
      .filter((d) => (tamano ? d.tamano === tamano : true))
      .filter((d) => (analisis ? d.analisis.includes(analisis) : true));
  }, [area, busqueda, tamano, analisis]);

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <button style={s.buttonAlt} onClick={onBack}>← Volver a la portada</button>
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
            <h3>Usos posibles</h3>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>{dataset.usos}</p>
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Código base en R</h2>
            <p style={{ color: "#475569", marginTop: 0 }}>Script sugerido para filtrar y preparar la base.</p>
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
            <p><strong>Unidad de análisis:</strong> {dataset.unidad}</p>
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Técnicas recomendadas</h2>
            {dataset.tecnicas.map((t) => <span key={t} style={s.badge}>{t}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Variables clave</h2>
            {dataset.variables.map((v) => <span key={v} style={s.badge}>{v}</span>)}
          </div>
          <div style={{ ...s.card, marginTop: "18px" }}>
            <h2 style={{ marginTop: 0 }}>Preguntas de investigación</h2>
            <ul style={{ color: "#475569", lineHeight: 1.8, paddingLeft: "20px" }}>
              {dataset.preguntas.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div style={s.linkBox}>
            {dataset.descarga && <p><strong>Archivo de datos:</strong> <a href={dataset.descarga} download>Descargar archivo</a></p>}
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
  const [origenDataset, setOrigenDataset] = useState("inicio");

  const scrollToSection = (id) => {
    setVista("inicio");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>Repertorio de Bases de Datos Chilenas</h1>
          <p style={s.headerSubtitle}>Plataforma académica para consulta, descarga y preparación de datos reales.</p>
        </div>
        <nav style={s.nav}>
          <span style={s.navItem} onClick={() => scrollToSection("top")}>Inicio</span>
          <span style={s.navItem} onClick={() => scrollToSection("datasets")}>Datasets</span>
          <span style={s.navItem} onClick={() => scrollToSection("ejercicios")}>Ejercicios</span>
          <span style={s.navItem} onClick={() => scrollToSection("fuentes")}>Fuentes</span>
        </nav>
      </header>

      <main id="top" style={s.mainWrap}>
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
            onOpenExercise={(exercise) => {
              setExerciseActual(exercise);
              setVista("exercise");
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

        {vista === "exercise" && (
          <ExercisePage
            exercise={exerciseActual}
            onBack={() => {
              setVista("inicio");
              setTimeout(() => {
                document.getElementById("ejercicios")?.scrollIntoView({ behavior: "smooth" });
              }, 0);
            }}
          />
        )}
      </main>
    </div>
  );
}