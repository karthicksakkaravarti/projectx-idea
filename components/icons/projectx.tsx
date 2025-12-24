import * as React from "react"
import type { SVGProps } from "react"

export function ProjectXIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={80}
            height={80}
            viewBox="0 0 80 80"
            fill="none"
            {...props}
        >
            <g fill="currentColor">
                {/* Top */}
                <circle cx="40" cy="8" r="4" />

                {/* Upper diagonal */}
                <circle cx="16" cy="20" r="4" />
                <circle cx="64" cy="20" r="4" />

                {/* Middle horizontal */}
                <circle cx="4" cy="40" r="4" />
                <circle cx="76" cy="40" r="4" />

                {/* Lower diagonal */}
                <circle cx="16" cy="60" r="4" />
                <circle cx="64" cy="60" r="4" />

                {/* Bottom */}
                <circle cx="40" cy="72" r="4" />

                {/* Center vertical */}
                <circle cx="40" cy="20" r="4" />
                <circle cx="40" cy="60" r="4" />

                {/* Inner horizontal */}
                <circle cx="16" cy="40" r="4" />
                <circle cx="64" cy="40" r="4" />
            </g>
        </svg>
    )
}
