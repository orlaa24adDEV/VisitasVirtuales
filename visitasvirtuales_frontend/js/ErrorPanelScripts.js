/* ===========================================================
   - Captura automatica de errores JS, red, CORS y promesas.
   - Almacenamiento local (localStorage).
   - Panel visual con filtros, busqueda y exportacion.
   - Sin envio a servidor ni dependencias externas.
   =========================================================== */

(function () {
  const STORAGE_KEY = "APP_ERROR_PANEL_LOCAL";

  // Estructura en memoria
  let errors = loadFromStorage(STORAGE_KEY) || [];

  // =============================
  // Referencias DOM
  // =============================
  const panel = document.getElementById("error-panel");
  const toggle = document.getElementById("ep-toggle");
  const tbody = document.getElementById("ep-body");
  const countEl = document.getElementById("ep-count");
  const clearBtn = document.getElementById("ep-clear");
  const closeBtn = document.getElementById("ep-close");
  const exportBtn = document.getElementById("ep-export");
  const filterSel = document.getElementById("ep-filter");
  const searchInput = document.getElementById("ep-search");

  // =============================
  // Interaccion del usuario
  // =============================

  // Mostrar / ocultar panel
  toggle.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    panel.setAttribute("aria-hidden", panel.classList.contains("hidden"));
    renderTable();
  });

  closeBtn.addEventListener("click", () => {
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
  });

  // Limpiar errores
  clearBtn.addEventListener("click", () => {
    if (!confirm("&iquest;Borrar todos los errores guardados?")) return;
    errors = [];
    saveToStorage(STORAGE_KEY, errors);
    renderTable();
  });

  // Exportar como JSON
  exportBtn.addEventListener("click", () => {
    const data = JSON.stringify(errors, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `error-log-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  filterSel.addEventListener("change", renderTable);
  searchInput.addEventListener("input", renderTable);

  // =============================
  // Render de tabla
  // =============================
  function renderTable() {
    tbody.innerHTML = "";
    const filter = filterSel.value;
    const q = (searchInput.value || "").toLowerCase();

    const list = errors
      .filter((e) => {
        if (filter && e.category !== filter) return false;
        if (
          q &&
          !(
            (e.category || "").toLowerCase().includes(q) ||
            (e.errorType || "").toLowerCase().includes(q) ||
            (e.message || "").toLowerCase().includes(q)
          )
        )
          return false;
        return true;
      })
      .slice()
      .reverse();

    for (const e of list) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><b>${escapeHtml(e.category || "--")}</b><div class="small">${escapeHtml(e.errorType || "--")}</div></td>
        <td>${escapeHtml(e.message || "")}<div class="small">${escapeHtml(e.suggestion || "")}</div></td>
        <td class="small">${escapeHtml(e.context || "")}</td>
        <td class="small">${escapeHtml(e.time)}</td>
        <td class="status-pending small">local</td>
      `;
      tbody.appendChild(tr);
    }

    countEl.textContent = errors.length;
  }

  // =============================
  // Utilidades
  // =============================

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch])
    );
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage full o deshabilitado", e);
    }
  }

  function loadFromStorage(key) {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  // =============================
  // Registro de errores
  // =============================

  function pushError(error) {
    error.id = "e_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    error.time = new Date().toLocaleString();
    errors.push(error);
    saveToStorage(STORAGE_KEY, errors);
    renderTable();
  }

  // API publica
  const API = {
    report: (opts) => {
      const e = {
        category: opts.category || "Manual",
        errorType: opts.errorType || opts.type || "Manual",
        message:
          opts.message ||
          (opts.error && opts.error.message) ||
          "Sin mensaje",
        suggestion: opts.suggestion || "",
        context:
          opts.context ||
          opts.stack ||
          (opts.error && opts.error.stack) ||
          "",
        meta: opts.meta || {}
      };
      pushError(e);
    },
    getErrors: () => errors.slice(),
    clearLocal: () => {
      errors = [];
      saveToStorage(STORAGE_KEY, errors);
      renderTable();
    }
  };

  // Exponer al global
  window.ErrorReporter = API;

  // =============================
  // Captura automatica
  // =============================

  // Errores JS
  window.addEventListener(
    "error",
    (ev) => {
      if (ev.error) {
        API.report({
          category: "JavaScript runtime",
          errorType: ev.error.name || "Error",
          message: `${ev.message} en ${ev.filename}:${ev.lineno}`,
          suggestion: "Revisa el stack y usa try/catch si es necesario.",
          context: ev.error.stack || ""
        });
      } else {
        API.report({
          category: "Resource",
          errorType: "ResourceLoadError",
          message:
            "Recurso no cargado: " +
            (ev.target?.src || ev.target?.href || ev.message),
          suggestion: "Verifica ruta o permisos del recurso.",
          context: ""
        });
      }
    },
    true
  );

  // Promesas no manejadas
  window.addEventListener("unhandledrejection", (ev) => {
    API.report({
      category: "Rechazo de Promesa",
      errorType: ev.reason?.name || "UnhandledPromiseRejection",
      message: ev.reason?.message || String(ev.reason),
      suggestion: "Agrega .catch() o try/catch en async/await.",
      context: ev.reason?.stack || ""
    });
  });

  // Interceptar fetch
  (function () {
    const _fetch = window.fetch;
    if (!_fetch) return;

    window.fetch = async function (...args) {
      try {
        const res = await _fetch.apply(this, args);
        if (!res.ok) {
          API.report({
            category: "HTTP / Red",
            errorType: `HTTP ${res.status}`,
            message: `${args[0]} -> ${res.status} ${res.statusText}`,
            suggestion: "Verifica el endpoint o servidor.",
            context: await res.clone().text().catch(() => "")
          });
        }
        return res;
      } catch (err) {
        const msg = err.message || String(err);
        const cat = msg.includes("CORS")
          ? "CORS"
          : msg.includes("timeout")
          ? "Conexion / Timeout"
          : "Conexion / Red";
        API.report({
          category: cat,
          errorType: err.name || "FetchError",
          message: `${args[0]} -> ${msg}`,
          suggestion: cat === "CORS"
            ? "Configura CORS en el servidor."
            : "Verifica conexion o disponibilidad del servidor.",
          context: err.stack || ""
        });
        throw err;
      }
    };
  })();

  // Interceptar XHR
  (function () {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url, ...rest) {
      this.__ep_url = url;
      this.__ep_method = method;
      return origOpen.apply(this, [method, url, ...rest]);
    };

    XHR.prototype.send = function (body) {
      this.addEventListener("load", function () {
        if (this.status >= 400) {
          API.report({
            category: "XHTTP",
            errorType: `HTTP ${this.status}`,
            message: `${this.__ep_method} ${this.__ep_url} -> ${this.status}`,
            suggestion: "Revisa la respuesta del servidor.",
            context:
              this.responseText?.slice(0, 300) || ""
          });
        }
      });

      this.addEventListener("error", function () {
        API.report({
          category: "XHTTP",
          errorType: "NetworkError",
          message: `${this.__ep_method} ${this.__ep_url} -> error de red`,
          suggestion: "Revisa conexion / CORS / servidor.",
          context: ""
        });
      });

      return origSend.apply(this, arguments);
    };
  })();

  // =============================
  // Inicializacion
  // =============================
  renderTable();

  if (errors.length > 0) {
    panel.classList.remove("hidden");
  }

  console.info("ErrorReporter (version local) inicializado correctamente");
})();
