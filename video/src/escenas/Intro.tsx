import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AMARILLO, NEGRO, Flecha, clamp, fontFamily, resorte, suave } from "../marca";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Intro"
      style={{ backgroundColor: AMARILLO, fontFamily, alignItems: "center", justifyContent: "center" }}
    >
      <Flecha
        size={760}
        color="rgba(0,0,0,.06)"
        style={{
          position: "absolute",
          right: -170,
          top: 90,
          translate: interpolate(frame, [0, 60], ["-120px 120px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      />
      <Interactive.Div
        name="Logo"
        style={{
          width: 380,
          height: 380,
          borderRadius: 64,
          overflow: "hidden",
          boxShadow: "0 40px 80px -30px rgba(0,0,0,.45)",
          scale: interpolate(frame, [0, 24], [0.4, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          rotate: interpolate(frame, [0, 24], ["-12deg", "0deg"], { ...clamp, easing: resorte }),
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>

      <Interactive.Div
        name="Nombre"
        style={{
          marginTop: 70,
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 0.98,
          letterSpacing: "-0.03em",
          color: NEGRO,
          textAlign: "center",
          opacity: interpolate(frame, [14, 30], [0, 1], clamp),
          translate: interpolate(frame, [14, 34], ["0px 60px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        Romana
        <br />
        CompuService
      </Interactive.Div>

      <Interactive.Div
        name="Frase"
        style={{
          marginTop: 34,
          fontSize: 46,
          fontWeight: 600,
          color: NEGRO,
          textAlign: "center",
          maxWidth: 940,
          opacity: interpolate(frame, [24, 40], [0, 1], clamp),
          translate: interpolate(frame, [24, 44], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        Computadoras, repuestos y servicio técnico
      </Interactive.Div>

      <Interactive.Div
        name="Etiqueta"
        style={{
          marginTop: 64,
          padding: "22px 44px",
          borderRadius: 999,
          backgroundColor: NEGRO,
          color: AMARILLO,
          fontSize: 48,
          fontWeight: 800,
          scale: interpolate(frame, [42, 58], [0.6, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          opacity: interpolate(frame, [42, 50], [0, 1], clamp),
        }}
      >
        ¡Ahora con tienda en línea!
      </Interactive.Div>
    </AbsoluteFill>
  );
};
