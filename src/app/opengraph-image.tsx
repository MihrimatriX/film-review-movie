import { ImageResponse } from "next/og";

export const alt = "Film Review — movies, series, celebrities, and film writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#020d18",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, #020d18 0%, #0a1a2e 48%, #1a0510 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#dd003f",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#dcf836",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 88px",
            height: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                background: "#dd003f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "16px solid transparent",
                  borderBottom: "16px solid transparent",
                  borderLeft: "28px solid #020d18",
                  marginLeft: 8,
                  display: "flex",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: 10,
                  color: "#dcf836",
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                Film
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  letterSpacing: 4,
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                Review
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 28,
              color: "rgba(244,244,245,0.78)",
              display: "flex",
            }}
          >
            Movies · Series · People · Blog
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 20,
              color: "rgba(244,244,245,0.5)",
              display: "flex",
            }}
          >
            Film and TV database with reviews, cast, and TMDB discovery
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
