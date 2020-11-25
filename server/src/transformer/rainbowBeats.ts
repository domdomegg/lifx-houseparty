import { App, Transformer } from '../app';

export class RainbowBeats implements Transformer {
    static key: string = 'rainbowBeats';
    key: string = RainbowBeats.key;

    private t: number;
    
    handleBeat(app: App) {
        app.lights.forEach(light => light.setColor({ color: { hue: (this.t * 90) % 360, saturation: 100, brightness: 100 }}));
        this.t++;
    }

    setup(app: App) {
        this.t = 0;
    }

    teardown(app: App) {
    }
}