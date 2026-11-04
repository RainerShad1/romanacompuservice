import { AbsoluteFill, Easing, Img,Interactive, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AMARILLO, BLANCO, GRIS, NEGRO, VERDE, clamp, fontFamily, resorte, suave } from "../marca";

// Productos en oferta del catálogo real (precio con 5% redondeado como en la tienda)
const PRODUCTOS = [
  { foto: "fotos/macbook.jpg", nombre: "MacBook Pro 13″", specs: "Core i5 · 16 GB · 1 TB SSD", antes: "27,950", ahora: "26,555", ahorras: "1,395" },
  { foto: "fotos/asus.jpg", nombre: "Asus Vivobook 14", specs: "Core i3 · 8 GB · 128 GB SSD", antes: "22,950", ahora: "21,805", ahorras: "1,145" },
  { foto: "fotos/hp.jpg", nombre: "Laptop HP 14", specs: "Intel N150 · 4 GB · 128 GB", antes: "16,950", ahora: "16,105", ahorras: "845" },
];
export const POR_PRODUCTO = 62;

const Tarjeta: React.FC<(typeof PRODUCTOS)[number]> = ({ foto, nombre, specs, antes, ahora, ahorras }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Interactive.Div
        name="Foto"
        style={{
          position: "absolute",
          top: 300,
          width: 630,
          height: 840,
          borderRadius: 48,
          overflow: "hidden",
          boxShadow: "0 40px 100px -30px rgba(0,0,0,.8)",
          translate: interpolate(frame, [0, 18, POR_PRODUCTO - 10, POR_PRODUCTO], ["700px 0px", "0px 0px", "0px 0px", "-700px 0px"], {
            ...clamp,
            easing: [suave, Easing.linear, Easing.in(Easing.cubic)],
          }),
          rotate: interpolate(frame, [0, 18], ["6deg", "0deg"], { ...clamp, easing: suave }),
        }}
      >
        <Img src={staticFile(foto)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            padding: "12px 26px",
            borderRadius: 999,
            backgroundColor: AMARILLO,
            color: NEGRO,
            fontSize: 52,
            fontWeight: 800,
            scale: interpolate(frame, [14, 26], [0, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
          }}
        >
          -5%
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Datos"
        style={{
          position: "absolute",
          top: 1186,
          width: 920,
          textAlign: "center",
          opacity: interpolate(frame, [8, 18, POR_PRODUCTO - 8, POR_PRODUCTO], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [8, 24], ["0px 40px", "0px 0px"], { ...clamp, easing: suave }),
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: BLANCO, letterSpacing: "-0.02em" }}>{nombre}</div>
        <div style={{ marginTop: 6, fontSize: 44, fontWeight: 600, color: GRIS }}>{specs}</div>
        <div style={{ marginTop: 26, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 28 }}>
          <span style={{ fontSize: 110, fontWeight: 800, color: AMARILLO, letterSpacing: "-0.03em" }}>RD${ahora}</span>
          <span style={{ fontSize: 50, fontWeight: 600, color: GRIS, textDecoration: "line-through" }}>RD${antes}</span>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Ahorras"
        style={{
          position: "absolute",
          top: 1590,
          padding: "18px 40px",
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,.16)",
          border: `3px solid ${VERDE}`,
          color: VERDE,
          fontSize: 52,
          fontWeight: 800,
          opacity: interpolate(frame, [20, 28, POR_PRODUCTO - 8, POR_PRODUCTO], [0, 1, 1, 0], clamp),
          scale: interpolate(frame, [20, 34], [0.6, 1], { ...clamp, easing: resorte, output: "perceptual-scale" }),
        }}
      >
        Ahorras RD${ahorras}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const Productos: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill name="Productos" style={{ backgroundColor: NEGRO, fontFamily }}>
      <Interactive.Div
        name="Título"
        style={{
          position: "absolute",
          top: 140,
          width: "100%",
          textAlign: "center",
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: BLANCO,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        Mira cuánto <span style={{ color: AMARILLO }}>ahorras</span>
      </Interactive.Div>
      {PRODUCTOS.map((p, i) => (
        <Sequence key={p.foto} name={p.nombre} from={i * POR_PRODUCTO} durationInFrames={POR_PRODUCTO} layout="absolute-fill">
          <Tarjeta {...p} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
