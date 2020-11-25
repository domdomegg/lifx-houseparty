import { App, Transformer } from '../app';

export class RainbowBeats implements Transformer {
    static key: string = 'rainbowBeats';
    key: string = RainbowBeats.key;

    private options = { colorPerBulb: false };

    private t: number;
    
    handleBeat(app: App) {
        app.lights.forEach(light => {
            light.setColor({ color: { hue: (this.t * 90) % 360, saturation: 100, brightness: 100 }})
            if (this.options.colorPerBulb) this.t++;
        });
        if (!this.options.colorPerBulb) this.t++;
    }

    setup(app: App) {
        this.t = 0;
    }

    teardown(app: App) {
    }
}