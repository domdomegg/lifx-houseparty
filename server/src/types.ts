import type { App } from './app';

export { App };

export interface Bindings {
    sources: { [key: string]: Source }
    transformers: { [key: string]: Transformer },
    sinks: { [key: string]: Sink },
}

export interface Setupable {
    setup: (app: App) => void;
}

export interface Teardownable {
    teardown: (app: App) => void;
}

export interface HSBKColor {
    hue: number;
    saturation: number;
    brightness: number;
    kelvin?: number;
}

export type Waveform = 'SAW' | 'SINE' | 'HALF_SINE' | 'TRIANGLE' | 'PULSE';

export interface Light {
    setColor(params: { color: HSBKColor, duration?: number, callback?: () => void }): void;
    setWaveform(params: { fromColor?: HSBKColor, toColor: HSBKColor, transient?: boolean, period: number, cycles?: number, skewRatio?: number, waveform: Waveform, callback?: () => void }): void;
}

export interface Source extends Setupable, Teardownable {
    key: string;
    onData?: (app: App, data: any) => void;
}

export interface Transformer extends Setupable, Teardownable {
    key: string;
    handleBeat?: (app: App) => void;
    onLightConnect?: (app: App, light: Light) => void;
    onLightDisconnect?: (app: App, light: Light) => void;
    onData?: (app: App, data: any) => void;
}

export interface Sink extends Setupable, Teardownable {
    key: string;
    onData?: (app: App, data: any) => void;
}