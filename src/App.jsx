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
];

const areas = [
  { nombre: "Educación", icono: "🎓", descripcion: "Bases para rendimiento académico y contexto escolar.", color: "#1d4ed8" },
  { nombre: "Datos sociales", icono: "📊", descripcion: "Bases para ingreso, pobreza, escolaridad, salud y desigualdad.", color: "#047857" },
  { nombre: "Salud", icono: "🏥", descripcion: "Bases para egresos hospitalarios, mortalidad y acceso a servicios de salud.", color: "#be123c" },
  { nombre: "Trabajo", icono: "💼", descripcion: "Bases para ocupación, desocupación, informalidad y condiciones laborales.", color: "#7c3aed" },
  { nombre: "Economía", icono: "💰", descripcion: "Bases para PIB regional, actividad económica e indicadores macroeconómicos.", color: "#b45309" },
  { nombre: "Medio ambiente", icono: "🌱", descripcion: "Bases para calidad del aire y análisis ambiental.", color: "#15803d" },
];

const fuentes = [
  { nombre: "Agencia de Calidad de la Educación", descripcion: "Bases educativas oficiales.", url: "https://informacionestadistica.agenciaeducacion.cl/#/bases" },
  { nombre: "Observatorio Social", descripcion: "Información oficial de CASEN.", url: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024" },
  { nombre: "DEIS / MINSAL", descripcion: "Datos abiertos de salud, como egresos hospitalarios y estadísticas sanitarias.", url: "https://deis.minsal.cl/#datos-abiertos" },
  { nombre: "Datos.gob.cl", descripcion: "Portal de datos abiertos del Estado, incluyendo datos del Ministerio de Salud.", url: "https://datos.gob.cl" },
  { nombre: "INE", descripcion: "Bases estadísticas oficiales, incluyendo Encuesta Nacional de Empleo.", url: "https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral" },
  { nombre: "Banco Central de Chile", descripcion: "Base de Datos Estadísticos con indicadores macroeconómicos y PIB regional.", url: "https://si3.bcentral.cl/Siete" },
  { nombre: "SINCA", descripcion: "Sistema de Información Nacional de Calidad del Aire.", url: "https://sinca.mma.gob.cl/index.php/" },
];