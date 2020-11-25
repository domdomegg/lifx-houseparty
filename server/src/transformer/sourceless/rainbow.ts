import { App, Transformer } from '../../app';

export class Rainbow implements Transformer {
    static key: string = 'rainbow';
    key: string = Rainbow.key;

    private interval: NodeJS.Timeout;
    private t: number;
    
    handleBeat() {}

    setup(app: App) {
        this.t = 0;
        this.interval = setInterval(() => {
            app.lights.forEach(light => light.set({ hue: (this.t * 90) % 360, saturation: 100, brightness: 100 }));
            this.t++;
        }, 250);
    }

    teardown(app: App) {
        clearInterval(this.interval);
    }
}