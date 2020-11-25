import { App, Transformer } from '../../app';

export class Strobe implements Transformer {
    static key: string = 'strobe';
    key: string = Strobe.key;

    private interval: NodeJS.Timeout;
    private t: number;
    
    handleBeat() {}

    setup(app: App) {
        this.t = 0;
        this.interval = setInterval(() => {
            app.lights.forEach(light => light.set({ hue: 0, saturation: 0, brightness: (this.t % 2) * 100 }));
            this.t++;
        }, 250);
    }

    teardown(app: App) {
        clearInterval(this.interval);
    }
}