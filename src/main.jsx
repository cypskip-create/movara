import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
  createContext,
  useContext,
} from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import {
  Icon,
  Logo,
  Button,
  Field,
  Badge,
  TruckImage,
  RouteMap,
  money,
  Empty,
} from "./ui";
import Landing from "./pages/Landing";
import Workspace from "./pages/Workspace";
import "./styles.css";
import brand from "../config/brand.json";
Object.entries(brand.colors).forEach(([key, value]) =>
  document.documentElement.style.setProperty("--" + key, value),
);
const Context = createContext();
export const useApp = () => useContext(Context);
export const go = (path) => {
  window.location.hash = path;
};
function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/"),
    [state, setState] = useState(null),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState(null),
    [busy, setBusy] = useState(false);
  async function refresh() {
    try {
      const r = await fetch("/api/state");
      if (!r.ok) throw Error("Could not load marketplace.");
      setState(await r.json());
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    refresh();
    const handler = () => {
      setRoute(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
      refresh();
    };
    window.addEventListener("hashchange", handler);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("hashchange", handler);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  useEffect(() => {
    if (!route.startsWith("/messages")) return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [route]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  async function api(action, body) {
    setBusy(true);
    try {
      const r = await fetch("/api/" + action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      await refresh();
      return data;
    } catch (e) {
      setToast(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  return (
    <MotionConfig reducedMotion="user">
      <Context.Provider
        value={{
          state,
          api,
          refresh,
          toast: setToast,
          modal: setModal,
          busy,
          route,
        }}
      >
        <a
          className="skip"
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById("main-content");
            if (target) {
              target.tabIndex = -1;
              target.focus();
              target.scrollIntoView();
            }
          }}
        >
          Skip to content
        </a>
        {route === "/" ? <Landing /> : <Workspace />}
        {error && (
          <div className="connection-error" role="alert">
            {error} <button onClick={refresh}>Retry</button>
          </div>
        )}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="toast"
              role="status"
            >
              {toast}
              <button
                aria-label="Dismiss notification"
                onClick={() => setToast("")}
              >
                <Icon name="close" size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {modal && (
          <Modal onClose={() => setModal(null)} title={modal.title}>
            {modal.content}
          </Modal>
        )}
      </Context.Provider>
    </MotionConfig>
  );
}
function Modal({ onClose, title, children }) {
  const ref = useRef(),
    previous = useRef(document.activeElement);
  useEffect(() => {
    ref.current.querySelector("button,input,select,a")?.focus();
    function key(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = [
          ...ref.current.querySelectorAll("button,input,select,a,textarea"),
        ].filter((x) => !x.disabled);
        const first = els[0],
          last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = old;
      previous.current?.focus();
    };
  }, []);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </motion.section>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
