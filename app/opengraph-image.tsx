import { ImageResponse } from "next/og"

export const alt = "ProjectX - Open-source AI chat interface"
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = "image/png"

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    backgroundImage:
                        "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
                    backgroundSize: "100px 100px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Logo */}
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g fill="white">
                            <circle cx="40" cy="8" r="4" />
                            <circle cx="16" cy="20" r="4" />
                            <circle cx="64" cy="20" r="4" />
                            <circle cx="4" cy="40" r="4" />
                            <circle cx="76" cy="40" r="4" />
                            <circle cx="16" cy="60" r="4" />
                            <circle cx="64" cy="60" r="4" />
                            <circle cx="40" cy="72" r="4" />
                            <circle cx="40" cy="20" r="4" />
                            <circle cx="40" cy="60" r="4" />
                            <circle cx="16" cy="40" r="4" />
                            <circle cx="64" cy="40" r="4" />
                        </g>
                    </svg>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 700,
                            color: "white",
                            marginTop: 32,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        ProjectX
                    </div>

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: 28,
                            color: "#888",
                            marginTop: 16,
                            textAlign: "center",
                            maxWidth: 800,
                        }}
                    >
                        The open-source AI chat interface for all your models
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
