import { App, Source } from '../app';

export class Bpm implements Source {
    static key: string = 'bpm';
    key: string = Bpm.key;

    private options = { bpm: 120 };

    private interval: NodeJS.Timeout;

    setup(app: App) {
        this.interval = setInterval(() => app.handleBeat(), 60000 / this.options.bpm);
    }

    onData(app: App, data: any) {
        this.options = data;
        clearInterval(this.interval);
        this.interval = setInterval(() => app.handleBeat(), 60000 / this.options.bpm);
    }

    teardown(app: App) {
        clearInterval(this.interval);
    }
}