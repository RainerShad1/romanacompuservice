import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AMARILLO, BLANCO, NEGRO, VERDE, Icono, clamp, fontFamily, resorte, suave } from "../marca";
import { CAPTURA, Telefono } from "../Telefono";

const ANCHO_TEL = 560;
const PANTALLA = ANCHO_TEL - 32;
const K = PANTALLA / CAPTURA;
const ALTO_PANTALLA = Math.round(1688 * K);
// Fila "Ahorras RD$1,395" en la captura del carrito (px a 2x)
const FILA = { x: 18, y: 1440, w: 744, h: 64 };

const PASOS = [
  { icono: "mouse-pointer-click", texto: "Elige" },
  { icono: "shopping-bag", texto: "Pide" },
  { icono: "store", texto: "Retira" },
];

export const Pedido: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Pedido" style={{ backgroundColor: AMARILLO, fontFamily, alignItems: "center" }}>
      <Interactive.Div
        name="Título"
        style={{
          marginTop: 130,
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: NEGRO,
          textAlign: "center",
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          translate: interpolate(frame, [0, 18], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        Pide en línea
        <br />y retira en tienda
      </Interactive.Div>

      <div style={{ marginTop: 40, display: "flex", gap: 22 }}>
        {PASOS.map((p, i) => (
          <Interactive.Div
            key={p.texto}
            name={p.texto}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 30px",
              borderRadius: 999,
              backgroundColor: NEGRO,
              color: AMARILLO,
              fontSize: 44,
              fontWeight: 800,
              scale: interpolate(frame, [10 + i * 6, 24 + i * 6], [0.5, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
              opacity: interpolate(frame, [10 + i * 6, 16 + i * 6], [0, 1], clamp),
            }}
          >
            <Icono nombre={p.icono} size={44} color={AMARILLO} grosor={2.4} />
            {p.texto}
          </Interactive.Div>
        ))}
      </div>

      <Telefono
        ancho={ANCHO_TEL}
        alto={ALTO_PANTALLA + 32}
        style={{
          position: "absolute",
          top: 560,
          translate: interpolate(frame, [4, 28], ["0px 400px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        <Img src={staticFile("tienda/producto-37.png")} style={{ position: "absolute", width: PANTALLA }} />
        <Img
          src={staticFile("tienda/carrito.png")}
          style={{
            position: "absolute",
            width: PANTALLA,
            translate: interpolate(frame, [40, 56], [`${PANTALLA}px 0px`, "0px 0px"], { ...clamp, easing: suave }),
          }}
        />
        <Interactive.Div
          name="Resalta ahorro"
          style={{
            position: "absolute",
            left: FILA.x * K,
            top: FILA.y * K,
            width: FILA.w * K,
            height: FILA.h * K,
            borderRadius: 18,
            border: `5px solid ${AMARILLO}`,
            boxShadow: "0 0 40px rgba(255,252,58,.55)",
            opacity: interpolate(frame, [60, 66], [0, 1], clamp),
            scale: interpolate(frame, [60, 74], [1.25, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          }}
        />
      </Telefono>

      <Interactive.Div
        name="Ahorras"
        style={{
          position: "absolute",
          top: 1330,
          padding: "22px 44px",
          borderRadius: 999,
          backgroundColor: VERDE,
          color: BLANCO,
          fontSize: 62,
          fontWeight: 800,
          boxShadow: "0 24px 60px -16px rgba(0,0,0,.55)",
          opacity: interpolate(frame, [66, 72], [0, 1], clamp),
          scale: interpolate(frame, [66, 82], [0.4, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          translate: interpolate(frame, [66, 82], ["0px 120px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        ¡Ahorras RD$1,395!
      </Interactive.Div>
    </AbsoluteFill>
  );
};
