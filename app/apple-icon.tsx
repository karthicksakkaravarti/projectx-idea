import { ImageResponse } from "next/og"

export const size = {
    width: 180,
    height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#000",
                    borderRadius: "32px",
                }}
            >
                <svg
                    width="140"
                    height="140"
                    viewBox="0 0 80 80"
                    fill="none"
                >
                    <g fill="white">
                        <circle cx="40" cy="8" r="5" />
                        <circle cx="16" cy="20" r="5" />
                        <circle cx="64" cy="20" r="5" />
                        <circle cx="4" cy="40" r="5" />
                        <circle cx="76" cy="40" r="5" />
                        <circle cx="16" cy="60" r="5" />
                        <circle cx="64" cy="60" r="5" />
                        <circle cx="40" cy="72" r="5" />
                        <circle cx="40" cy="20" r="5" />
                        <circle cx="40" cy="60" r="5" />
                        <circle cx="16" cy="40" r="5" />
                        <circle cx="64" cy="40" r="5" />
                    </g>
                </svg>
            </div>
        ),
        {
            ...size,
        }
    )
}
