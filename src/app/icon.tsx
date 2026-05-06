import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8f6",
          color: "#1d2636",
          fontFamily: "Menlo, Consolas, monospace",
          fontSize: 142,
          fontWeight: 800,
          letterSpacing: 0,
          border: "24px solid #1d2636",
        }}
      >
        m<span style={{ color: "#08769a" }}>.</span>
      </div>
    ),
    size,
  );
}
