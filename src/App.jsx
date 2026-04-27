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