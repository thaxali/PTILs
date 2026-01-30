import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FDFBF7",
      }}
    >
      <div
        style={{
          width: 80,
          height: 120,
          borderRadius: 40,
          background: "#F38A21",
          transform: "skewX(-6.6deg)",
        }}
      />
    </div>,
    { ...size }
  );
}
