import VanillaTilt from "vanilla-tilt"

interface Options {
    reverse?: boolean,
    max?: number,
    startX?: number,
    startY?: number,
    perspective?: number,
    scale?: number,
    speed?: number,
    transition?: boolean,
    axis?: "x" | "y" | undefined,
    reset?: boolean,
    "reset-to-start"?: boolean,
    easing?: string,
    glare?: boolean,
    "max-glare"?: number,
    "glare-prerender"?: boolean,
    gyroscope?: boolean,
    gyroscopeMinAngleX?: number,
    gyroscopeMaxAngleX?: number,
    gyroscopeMinAngleY?: number,
    gyroscopeMaxAngleY?: number,
    gyroscopeSamples?: number,
    "mouse-event-element"?: undefined | string,
    "full-page-listening"?: boolean
}

const defaultOptions: Options = {
    reverse: false,
    max: 10,
    startX: 0,
    startY: 0,
    perspective: 1000,
    scale: 1,
    speed: 300,
    transition: true,
    axis: undefined,
    reset: true,
    "reset-to-start": true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
    glare: true,
    "max-glare": 0.3,
    "glare-prerender": false,

    "mouse-event-element": undefined,
    "full-page-listening": false,
    gyroscope: true,
    gyroscopeMinAngleX: -45,
    gyroscopeMaxAngleX: 45,
    gyroscopeMinAngleY: -45,
    gyroscopeMaxAngleY: 45,
    gyroscopeSamples: 10
}

export function tilt(element: HTMLElement, options?: Options) {
    const settings = Object.assign(defaultOptions, options)

    VanillaTilt.init(element, settings)
}