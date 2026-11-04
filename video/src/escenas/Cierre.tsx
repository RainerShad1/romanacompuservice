import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AMARILLO, INSTAGRAM, NEGRO, TELEFONO, TIENDA, Icono, clamp, fontFamily, resorte, suave } from "../marca";

const entra = (frame: number, desde: number) => ({
  opacity: interpolate(frame, [desde, desde + 10], [0, 1], clamp),
  translate: interpolate(frame, [desde, desde + 18], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
});

export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Cierre"
      style={{ backgroundColor: AMARILLO, fontFamily, alignItems: "center", justifyContent: "center", color: NEGRO }}
    >
      <Interactive.Div
        name="Logo"
        style={{
          width: 240,
          height: 240,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 30px 60px -24px rgba(0,0,0,.45)",
          scale: interpolate(frame, [0, 20], [0.5, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
        }}
      >
        <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>

      <Interactive.Div
        name="Título"
        style={{
          marginTop: 56,
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textAlign: "center",
          ...entra(frame, 6),
        }}
      >
        Compra hoy
        <br />y ahorra 5%
      </Interactive.Div>

      <Interactive.Div
        name="Enlace"
        style={{
          marginTop: 70,
          width: 920,
          padding: "30px 0",
          borderRadius: 32,
          backgroundColor: NEGRO,
          color: AMARILLO,
          textAlign: "center",
          ...entra(frame, 16),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 36, fontWeight: 600, color: "#e9e9e0" }}>
          <Icono nombre="globe" size={36} color="#e9e9e0" />
          Visita la tienda
        </div>
        <div style={{ marginTop: 10, fontSize: 40, fontWeight: 800, letterSpacing: "-0.01em" }}>{TIENDA}</div>
      </Interactive.Div>

      <Interactive.Div name="WhatsApp" style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 18, fontSize: 58, fontWeight: 800, ...entra(frame, 26) }}>
        <Icono nombre="message-circle" size={60} color={NEGRO} grosor={2.4} />
        {TELEFONO}
      </Interactive.Div>

      <Interactive.Div name="Instagram" style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, fontSize: 54, fontWeight: 700, ...entra(frame, 32) }}>
        <Icono nombre="instagram" size={56} color={NEGRO} grosor={2.2} />
        {INSTAGRAM}
      </Interactive.Div>

      <Interactive.Div name="Lugar" style={{ marginTop: 56, fontSize: 40, fontWeight: 600, opacity: interpolate(frame, [40, 52], [0, 0.75], clamp) }}>
        La Romana, República Dominicana
      </Interactive.Div>
    </AbsoluteFill>
  );
};
