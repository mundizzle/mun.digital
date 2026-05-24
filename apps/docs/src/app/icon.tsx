import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#20242a",
          color: "#5ab8ff",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 18,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        m
      </div>
    ),
    size,
  );
}
