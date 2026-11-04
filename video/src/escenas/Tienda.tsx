import { AbsoluteFill, Easing, Img,Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AMARILLO, BLANCO, NEGRO, clamp, fontFamily, suave } from "../marca";
import { CAPTURA, Telefono } from "../Telefono";

const ANCHO_TEL = 640;
const PANTALLA = ANCHO_TEL - 32;
const K = PANTALLA / CAPTURA;
const ALTO_PANTALLA = Math.round(1688 * K);
const LARGO = 5912 * K;
const BARRA = 114 * K; // barra de abajo de la tienda

export const Tienda: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Tienda" style={{ backgroundColor: NEGRO, fontFamily, alignItems: "center" }}>
      <Interactive.Div
        name="Título"
        style={{
          marginTop: 130,
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: BLANCO,
          textAlign: "center",
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
          translate: interpolate(frame, [0, 20], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        Tu tienda de tecnología
        <br />
        <span style={{ color: AMARILLO }}>en tu celular</span>
      </Interactive.Div>

      <Telefono
        ancho={ANCHO_TEL}
        alto={ALTO_PANTALLA + 32}
        style={{
          position: "absolute",
          top: 430,
          translate: interpolate(frame, [4, 30], ["0px 500px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        <Img
          src={staticFile("tienda/largo.png")}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PANTALLA,
            translate: interpolate(
              frame,
              [34, 110],
              ["0px 0px", `0px ${-(LARGO * 0.56 - ALTO_PANTALLA)}px`],
              { ...clamp, easing: Easing.inOut(Easing.cubic) },
            ),
          }}
        />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: PANTALLA, height: BARRA, overflow: "hidden" }}>
          <Img
            src={staticFile("tienda/home.png")}
            style={{ position: "absolute", left: 0, bottom: 0, width: PANTALLA }}
          />
        </div>
      </Telefono>
    </AbsoluteFill>
  );
};
