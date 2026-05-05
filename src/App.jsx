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
    tecnicas: ["Histogramas", "Boxplots por pobreza", "Gráficos de dispersión", "Correlación", "Regresión lineal", "Regresión logística"],
    preguntas: [
      "¿Existe relación entre escolaridad e ingreso?",
      "¿Las personas en pobreza tienen menor escolaridad?",
      "¿Existen diferencias regionales en ingreso o acceso a salud?",
      "¿Qué variables se asocian con problemas para conseguir atención médica?",
    ],
    variables: ["edad", "sexo", "region", "area", "esc", "ytot", "pobreza", "pobreza_multi", "asiste", "desercion", "hh_d_acc", "s19b", "s19d", "s19e", "nse"],
    descarga: "",
    fuenteOriginal: "https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-2024",
    script: `load("casen_2024")

datos_casen <- casen_2024

# 1. Seleccionar variables sociales, económicas y de salud
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

# 2. Reemplazar códigos especiales por NA
codigos_invalidos <- c(-88, -99, -77, -66, -9, -8, -7, -6)
for (v in names(casen)) {
  casen[[v]][casen[[v]] %in% codigos_invalidos] <- NA
}

# 3. Filtrar variables mínimas completas
casen <- subset(casen,
                !is.na(edad) &
                !is.na(sexo) &
                !is.na(region) &
                !is.na(area))

# 4. Crear base para análisis de personas desde 15 años
casen_15 <- subset(casen,
                   edad >= 15 &
                   !is.na(esc) &
                   !is.na(ytot))

casen_15 <- subset(casen_15,
                   esc >= 0 &
                   ytot >= 0)

# 5. Crear variables útiles para análisis posteriores
casen_15$log_ytot <- log1p(casen_15$ytot)
casen_15$rm_o_r <- ifelse(casen_15$region == 13,
                          "Metropolitana",
                          "Regiones")
casen_15$problema_hora <- ifelse(casen_15$s19b == 1, 1,
                                 ifelse(casen_15$s19b == 2, 0, NA))

# 6. Convertir variables categóricas
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

# 7. Convertir variables categóricas
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
    fuenteNombre: "ODEPA",
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
    fuenteOriginal: "https://www.odepa.gob.cl/estadisticas-del-sector/precios",
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
    fuenteNombre: "ODEPA",
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
    fuenteOriginal: "https://www.odepa.gob.cl/estadisticas-del-sector/precios",
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

# 7. Convertir variables categóricas
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
    fuenteNombre: "Banco Central / INE",
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
    fuenteOriginal: "https://si3.bcentral.cl/Siete",
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
];

const areas = [
  { nombre: "Educación", icono: "🎓", descripcion: "Bases para rendimiento académico y contexto escolar.", color: "#1d4ed8" },
  { nombre: "Datos sociales", icono: "📊", descripcion: "Bases para ingreso, pobreza, escolaridad, salud y desigualdad.", color: "#047857" },
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
  { nombre: "ODEPA", descripcion: "Información de precios agrícolas y mercados agropecuarios.", url: "https://www.odepa.gob.cl/estadisticas-del-sector/precios" },
  { nombre: "Dirección Meteorológica de Chile", descripcion: "Datos meteorológicos, temperaturas y precipitación.", url: "https://datos.gob.cl" },
  { nombre: "Subsecretaría de Pesca y Acuicultura", descripcion: "Datos sectoriales sobre pesca, acuicultura y empleo en plantas de proceso.", url: "https://datos.gob.cl" },
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
};

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

function Home({ onOpenArea, onOpenDataset, onOpenExercise, onOpenCatalog, onOpenAreas }) {
  const [busquedaHome, setBusquedaHome] = useState("");

  const resultadosBusqueda = useMemo(() => {
    if (!busquedaHome.trim()) return datasets.slice(0, 8);
    return datasets.filter((d) =>
      [d.nombre, d.area, d.descripcion, d.contexto, d.fuenteNombre, d.formato, ...d.variables, ...d.tecnicas, ...d.preguntas]
        .join(" ")
        .toLowerCase()
        .includes(busquedaHome.toLowerCase())
    );
  }, [busquedaHome]);

  const areasDestacadas = areas.slice(0, 6);

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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px", marginTop: "40px" }}>
        <div>
          <h2 id="datasets" style={s.title}>{busquedaHome.trim() ? "Resultados de búsqueda" : "Datasets destacados"}</h2>
          <p style={s.sectionSubtitle}>
            {busquedaHome.trim()
              ? `Se encontraron ${resultadosBusqueda.length} resultado(s).`
              : "Vista inicial con una selección de bases. Para ver el catálogo completo, usa el botón Ver más."}
          </p>
        </div>
        {!busquedaHome.trim() && <button style={s.buttonAlt} onClick={onOpenCatalog}>Ver más datasets</button>}
      </div>

      <div style={s.grid}>
        {resultadosBusqueda.map((d) => <DatasetCard key={d.id} d={d} onOpenDataset={onOpenDataset} />)}
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

function CatalogPage({ onBack, onOpenDataset }) {
  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState("");

  const filtrados = useMemo(() => {
    return datasets
      .filter((d) => (area ? d.area === area : true))
      .filter((d) => {
        if (!busqueda.trim()) return true;
        return [d.nombre, d.area, d.descripcion, d.contexto, d.fuenteNombre, d.formato, ...d.variables, ...d.tecnicas, ...d.preguntas]
          .join(" ")
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      });
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
          <span style={s.navItem} onClick={() => setVista("catalogo")}>Datasets</span>
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
            onOpenCatalog={() => setVista("catalogo")}
            onOpenAreas={() => setVista("areas")}
          />
        )}

        {vista === "catalogo" && (
          <CatalogPage
            onBack={() => setVista("inicio")}
            onOpenDataset={(dataset, origen) => {
              setDatasetActual(dataset);
              setOrigenDataset(origen);
              setVista("dataset");
            }}
          />
        )}

        {vista === "areas" && (
          <AreasListPage
            onBack={() => setVista("inicio")}
            onOpenArea={(area) => {
              setAreaActual(area);
              setVista("area");
            }}
          />
        )}

        {vista === "area" && (
          <AreaPage
            area={areaActual}
            onBack={() => setVista("areas")}
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
