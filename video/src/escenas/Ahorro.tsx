import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { AMARILLO, NEGRO, Flecha, clamp, fontFamily, resorte, suave } from "../marca";

export const Ahorro: React.FC = () => {
  const frame = useCurrentFrame();
  const numero = Math.round(interpolate(frame, [10, 34], [0, 5], { ...clamp, easing: suave }));

  return (
    <AbsoluteFill
      name="Ahorro"
      style={{ backgroundColor: AMARILLO, fontFamily, alignItems: "center", justifyContent: "center" }}
    >
      <Interactive.Div
        name="Arriba"
        style={{
          padding: "20px 40px",
          borderRadius: 999,
          backgroundColor: NEGRO,
          color: AMARILLO,
          fontSize: 46,
          fontWeight: 800,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          translate: interpolate(frame, [0, 16], ["0px -40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        Comprando en la tienda en línea
      </Interactive.Div>

      <div style={{ position: "relative", display: "flex", alignItems: "flex-start", marginTop: 30 }}>
        <Interactive.Div
          name="Cinco"
          style={{
            fontSize: 560,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: NEGRO,
            fontVariantNumeric: "tabular-nums",
            scale: interpolate(frame, [6, 30], [0.5, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          }}
        >
          {numero}%
        </Interactive.Div>
        <Flecha
          size={130}
          color={NEGRO}
          style={{
            position: "absolute",
            right: -70,
            top: 10,
            opacity: interpolate(frame, [30, 38], [0, 1], clamp),
            translate: interpolate(frame, [30, 46], ["-60px 60px", "0px 0px"], { ...clamp, easing: resorte }),
          }}
        />
      </div>

      <Interactive.Div
        name="De ahorro"
        style={{
          marginTop: -10,
          fontSize: 132,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: NEGRO,
          opacity: interpolate(frame, [26, 38], [0, 1], clamp),
          translate: interpolate(frame, [26, 44], ["0px 50px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        de ahorro
      </Interactive.Div>

      <Interactive.Div
        name="En la mayoría"
        style={{
          marginTop: 30,
          fontSize: 60,
          fontWeight: 700,
          color: NEGRO,
          textAlign: "center",
          opacity: interpolate(frame, [40, 52], [0, 1], clamp),
          translate: interpolate(frame, [40, 58], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        en la mayoría de los productos
      </Interactive.Div>
    </AbsoluteFill>
  );
};
