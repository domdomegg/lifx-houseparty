import { App, Transformer, Light, Waveform } from '../../app';

let strobeParams = { fromColor: { hue: 0, saturation: 0, brightness: 0 }, toColor: { hue: 0, saturation: 0, brightness: 100 }, period: 50, skewRatio: 0.9, waveform: 'PULSE' as Waveform };

export class Strobe implements Transformer {
    static key: string = 'strobe';
    key: string = Strobe.key;
    
    setup(app: App) {
        app.lights.forEach(light => light.setWaveform(strobeParams));
    }

    onLightConnect(app: App, light: Light) {
        light.setWaveform(strobeParams)
    }

    onData(app: App, data: any) {
        strobeParams = data;
        app.lights.forEach(light => light.setWaveform(strobeParams));
    }

    teardown(app: App) {
        app.lights.forEach(light => light.setColor({ color: { hue: 0, saturation: 0, brightness: 0 }}));
    }
}