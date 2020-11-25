import express from 'express';
import { Nothing as NothingTransformer } from './transformer/sourceless/nothing';
import { Nothing as NothingSource } from './source/nothing';

export class App {
    lights: Light[] = [];
    private transformer: Transformer = new NothingTransformer();
    private source: Source = new NothingSource();

    private bindings: Bindings = { transformers: {}, sources: {} } 

    setup(setupable: Setupable) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        setupable.setup(this);
    }

    teardown(teardownable: Teardownable) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        teardownable.teardown(this);
    }

    addLight(light: Light) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        this.lights.push(light);
        if (this.transformer.onLightConnect) this.transformer.onLightConnect(this, light);
    }

    setTransformer(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const transformer = this.bindings.transformers[key];
        if (!transformer) throw new Error('Transformer ' + key + ' not found');

        const oldTransformer = this.transformer;
        this.transformer = new NothingTransformer();
        oldTransformer.teardown(this);
        
        transformer.setup(this);
        this.transformer = transformer;
    }

    bindTransformer(transformer: Transformer) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        this.bindings.transformers[transformer.key] = transformer;
    }

    setSource(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const source = this.bindings.sources[key];
        if (!source) throw new Error('Source ' + key + ' not found');

        const oldSource = this.source;
        this.source = new NothingSource();
        oldSource.teardown(this);
        
        source.setup(this);
        this.source = source;
    }

    bindSource(source: Source) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        this.bindings.sources[source.key] = source;
    }

    startServer() {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const app = express();
        const bodyParser = require('body-parser');
        app.use(bodyParser.json());

        app.put('/transformer', (req, res) => {
            this.setTransformer(req.body.key);
            res.send({ source: this.source.key, transformer: this.transformer.key });
        });

        app.post('/transformer/data', (req, res) => {
            if (this.transformer.onData) this.transformer.onData(this, req.body);
            res.send({ source: this.source.key, transformer: this.transformer.key });
        });

        app.put('/source', (req, res) => {
            this.setSource(req.body.key);
            res.send({ source: this.source.key, transformer: this.transformer.key });
        });

        app.post('/source/data', (req, res) => {
            if (this.source.onData) this.source.onData(this, req.body);
            res.send({ source: this.source.key, transformer: this.transformer.key });
        });

        app.listen(4000, () => {
            console.log(`Server started at http://localhost:4000`);
        });
    }

    handleBeat() {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        if (this.transformer.handleBeat) this.transformer.handleBeat(this)
    }
}

interface Bindings {
    transformers: { [key: string]: Transformer },
    sources: { [key: string]: Source }
}

interface Setupable {
    setup: (app: App) => void;
}
interface Teardownable {
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