import { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

/**
 * Code runner pentru mobile. Rulează:
 *   - python via Pyodide (CDN, încărcat la nevoie în WebView ascuns)
 *   - javascript via eval în WebView (sandbox)
 *   - html / css → preview vizual
 *
 * Props:
 *   language: 'python' | 'javascript' | 'html' | 'css'
 *   code: string
 *   onOutput?: (output: string) => void  — primește stdout-ul după rulare (folosit la AI grade)
 *
 * Folosit ca buton + zonă de output integrată.
 */
export default function CodeRunner({ language = 'python', code = '', onOutput }) {
  const webRef = useRef(null);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const lang = (language || 'python').toLowerCase();
  const isPreviewLang = lang === 'html' || lang === 'css';

  const runHtml = useMemo(() => buildRunnerHtml(lang), [lang]);
  const previewHtml = useMemo(() => buildPreviewHtml(lang, code), [lang, code]);

  const handleRun = useCallback(() => {
    if (isPreviewLang) {
      setShowPreview(true);
      return;
    }
    if (!code.trim()) {
      setOutput('// Scrie cod pentru a rula');
      return;
    }
    setRunning(true);
    setOutput('Se rulează…');
    // Trimite codul către WebView via injectedJavaScript
    const escaped = JSON.stringify(code);
    const js = `window.__runUserCode && window.__runUserCode(${escaped}); true;`;
    webRef.current?.injectJavaScript(js);
  }, [code, isPreviewLang]);

  const onMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        // ok
      } else if (data.type === 'output') {
        setOutput(data.text || '');
        setRunning(false);
        onOutput?.(data.text || '');
      } else if (data.type === 'error') {
        setOutput(`❌ ${data.text || 'Eroare necunoscută'}`);
        setRunning(false);
        onOutput?.(`ERROR: ${data.text || ''}`);
      }
    } catch {
      // ignore
    }
  }, [onOutput]);

  return (
    <View className="mt-2">
      <View className="flex-row gap-2">
        <Pressable
          onPress={handleRun}
          disabled={running}
          className="flex-row items-center gap-1.5 bg-emerald-600 rounded-xl px-4 py-2.5 active:opacity-80"
          style={{ opacity: running ? 0.5 : 1 }}
        >
          {running ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name={isPreviewLang ? 'eye' : 'play'} size={16} color="#fff" />
          )}
          <Text className="text-white font-extrabold text-xs">
            {isPreviewLang ? 'Previzualizează' : 'Rulează cod'}
          </Text>
        </Pressable>
        {(output || showPreview) && (
          <Pressable
            onPress={() => { setOutput(''); setShowPreview(false); }}
            className="flex-row items-center gap-1.5 bg-slate-200 rounded-xl px-3 py-2.5 active:opacity-80"
          >
            <Ionicons name="trash-outline" size={14} color="#475569" />
            <Text className="text-slate-700 font-bold text-xs">Curăță</Text>
          </Pressable>
        )}
      </View>

      {/* Output panel */}
      {!isPreviewLang && output ? (
        <ScrollView
          className="mt-2 rounded-xl"
          style={{ backgroundColor: '#0f172a', maxHeight: 200 }}
          contentContainerStyle={{ padding: 10 }}
        >
          <Text
            selectable
            style={{ color: '#86efac', fontFamily: 'monospace', fontSize: 12 }}
          >
            {output}
          </Text>
        </ScrollView>
      ) : null}

      {/* Preview WebView for HTML/CSS */}
      {isPreviewLang && showPreview ? (
        <View className="mt-2 rounded-xl overflow-hidden border border-slate-200" style={{ height: 320, backgroundColor: '#fff' }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: previewHtml }}
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
        </View>
      ) : null}

      {/* Hidden WebView running interpreter (python/js) */}
      {!isPreviewLang ? (
        <View style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }} pointerEvents="none">
          <WebView
            ref={webRef}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            source={{ html: runHtml }}
            onMessage={onMessage}
            mixedContentMode="always"
          />
        </View>
      ) : null}
    </View>
  );
}

// ---------- HTML builders ----------

function buildRunnerHtml(lang) {
  if (lang === 'javascript') {
    return `<!doctype html><html><head><meta charset="utf-8" /></head><body>
<script>
(function () {
  function send(obj) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(obj));
  }
  window.__runUserCode = function (code) {
    var logs = [];
    var origLog = console.log;
    console.log = function () {
      var parts = [];
      for (var i = 0; i < arguments.length; i++) {
        try { parts.push(typeof arguments[i] === 'object' ? JSON.stringify(arguments[i]) : String(arguments[i])); }
        catch (e) { parts.push(String(arguments[i])); }
      }
      logs.push(parts.join(' '));
      origLog.apply(console, arguments);
    };
    try {
      // Sandboxed eval — fără acces la window/document direct
      var fn = new Function('"use strict";\\n' + code);
      var result = fn();
      if (result !== undefined) logs.push(String(result));
      send({ type: 'output', text: logs.join('\\n') || '(fără output)' });
    } catch (e) {
      send({ type: 'error', text: (e && e.message) || String(e) });
    } finally {
      console.log = origLog;
    }
  };
  send({ type: 'ready' });
})();
</script>
</body></html>`;
  }
  // Python via Pyodide
  return `<!doctype html><html><head><meta charset="utf-8" />
<script src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"></script>
</head><body>
<script>
(function () {
  function send(obj) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(obj));
  }
  var pyodideReady = null;
  var pendingCode = null;

  async function loadPy() {
    if (!pyodideReady) {
      pyodideReady = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" });
    }
    return pyodideReady;
  }

  window.__runUserCode = async function (code) {
    try {
      var pyodide = await loadPy();
      // Capture stdout
      pyodide.runPython("import sys, io\\nsys.stdout = io.StringIO()\\nsys.stderr = sys.stdout");
      try {
        await pyodide.runPythonAsync(code);
      } catch (err) {
        var trace = pyodide.runPython("sys.stdout.getvalue()");
        send({ type: 'error', text: (trace ? trace + '\\n' : '') + (err && err.message ? err.message : String(err)) });
        return;
      }
      var out = pyodide.runPython("sys.stdout.getvalue()");
      send({ type: 'output', text: out || '(fără output)' });
    } catch (e) {
      send({ type: 'error', text: 'Pyodide nu a putut fi încărcat. Verifică internetul.' });
    }
  };

  // Pre-load pyodide imediat (în background) ca primul run să fie rapid
  loadPy().then(function () { send({ type: 'ready' }); });
})();
</script>
</body></html>`;
}

function buildPreviewHtml(lang, code) {
  if (lang === 'css') {
    return `<!doctype html><html><head><meta charset="utf-8" />
<style>${escapeForStyle(code)}</style></head>
<body>
<div class="demo">
  <h1>Titlu</h1>
  <p>Text de exemplu pentru a testa stilul.</p>
  <button>Buton</button>
</div>
</body></html>`;
  }
  // html
  return `<!doctype html>${code}`;
}

function escapeForStyle(s) {
  return String(s || '').replace(/<\/style>/gi, '<\\/style>');
}
