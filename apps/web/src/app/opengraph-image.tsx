import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Mundi Morgado - UX Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const image = await readFile(join(process.cwd(), "public/images/mundi.png"));
  const imageSrc = `data:image/png;base64,${image.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f8f6",
          color: "#1d2636",
          display: "flex",
          position: "relative",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#d9dfdc 1px, transparent 1px), linear-gradient(90deg, #d9dfdc 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.72,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 42,
            height: 2,
            background: "#1d2636",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            padding: "110px 56px 88px",
            gap: 72,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 586,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#627084",
                fontSize: 28,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: "#08769a",
                }}
              />
              CV
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 76,
                lineHeight: 0.92,
                fontWeight: 800,
                letterSpacing: 0,
                marginBottom: 28,
              }}
            >
              <div>Mundi</div>
              <div>Morgado</div>
            </div>
            <div
              style={{
                color: "#08769a",
                fontFamily: "Menlo, Consolas, monospace",
                fontSize: 27,
                fontWeight: 700,
                letterSpacing: 6,
                marginBottom: 38,
              }}
            >
              UX ENGINEER
            </div>
            <div
              style={{
                color: "#627084",
                fontSize: 28,
                lineHeight: 1.34,
                fontWeight: 700,
                width: 560,
                marginBottom: 30,
              }}
            >
              25+ years shipping products, platforms, and design systems. Now building for the AI era, where agents are users too.
            </div>
            <div
              style={{
                color: "#627084",
                fontFamily: "Menlo, Consolas, monospace",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              MUN.DIGITAL
            </div>
          </div>
          <img
            src={imageSrc}
            alt=""
            style={{
              width: 430,
              height: 456,
              objectFit: "cover",
              objectPosition: "50% 26%",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
