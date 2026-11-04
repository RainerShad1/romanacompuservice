import { Interactive } from "remotion";

// Marco de celular. Las capturas de la tienda miden 780px de ancho (390 a 2x).
export const CAPTURA = 780;

export const Telefono: React.FC<{
  ancho: number;
  alto: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ ancho, alto, style, children }) => (
  <Interactive.Div
    name="Teléfono"
    style={{
      width: ancho,
      height: alto,
      padding: 16,
      borderRadius: 72,
      background: "linear-gradient(160deg, #3a3a36, #121211 45%, #2a2a27)",
      boxShadow: "0 50px 120px -30px rgba(0,0,0,.75), inset 0 0 0 2px rgba(255,255,255,.08)",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 58,
        overflow: "hidden",
        background: "#0d0d0c",
      }}
    >
      {children}
    </div>
  </Interactive.Div>
);
