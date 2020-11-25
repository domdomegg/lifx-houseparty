import { App, Transformer, Light, Waveform } from '../../types';

export class Strobe implements Transformer {
    static key: string = 'strobe';
    key: string = Strobe.key;

    private options = { fromColor: { hue: 0, saturation: 0, brightness: 0 }, toColor: { hue: 0, saturation: 0, brightness: 100 }, period: 50, skewRatio: 0.9, waveform: 'PULSE' as Waveform };
    
    setup(app: App) {
        app.lights.forEach(light => light.setWaveform(this.options));
    }

    onLightConnect(app: App, light: Light) {
        light.setWaveform(this.options)
    }

    onData(app: App, data: any) {
        this.options = data;
        app.lights.forEach(light => light.setWaveform(this.options));
    }

    teardown(app: App) {
        app.lights.forEach(light => light.setColor({ color: { hue: 0, saturation: 0, brightness: 0 }}));
    }
}