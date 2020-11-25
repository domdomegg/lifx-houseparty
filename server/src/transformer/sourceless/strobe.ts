import { App, Transformer } from '../../app';

export class Strobe implements Transformer {
    static key: string = 'strobe';
    key: string = Strobe.key;

    private interval: NodeJS.Timeout;
    
    handleBeat() {}

    setup(app: App) {
        app.lights.forEach(light => {
            const r = light.raw as any;
            r.setColor({
                color: {
                    hue: 0,
                    saturation: 0,
                    brightness: 0,
                    kelvin: 3500
                }
            }).then(() => {
                r.lightSetWaveform({
                    transient: 1,
                    color: {
                        hue: 0,
                        saturation: 0,
                        brightness: 1,
                        kelvin: 3500
                    },
                    period: 50,
                    cycles: 1e20,
                    skew_ratio: 0.9,
                    waveform: 4,
                });
            })
        })
    }

    teardown(app: App) {
        clearInterval(this.interval);
    }
}