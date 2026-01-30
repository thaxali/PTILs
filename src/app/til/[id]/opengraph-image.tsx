import { ImageResponse } from "next/og";
import { getPtilById } from "@/lib/ptils";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ptil = getPtilById(id);

  if (!ptil) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#2D2A32", color: "#fff", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
        PTILS
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ptil.imageUrl}
        alt=""
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Content layer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          position: "relative",
          padding: "40px 48px",
          justifyContent: "space-between",
        }}
      >
        {/* Top: Logo text + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "white",
              letterSpacing: "0.15em",
            }}
          >
            PTILS
          </span>
          <span
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Discover New AI Prompts
          </span>
        </div>

        {/* Bottom: "Today's prompt is" + blurred title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Today&apos;s prompt is
          </span>
          <span
            style={{
              fontSize: 42,
              color: "rgba(255,255,255,0.8)",
              filter: "blur(14px)",
              lineHeight: 1.25,
              maxWidth: "90%",
            }}
          >
            {ptil.title}
          </span>

          {/* Watermark */}
          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}
            >
              ptils.me
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
