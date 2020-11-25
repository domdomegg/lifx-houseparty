import express from 'express';
import { Nothing as NothingTransformer } from './transformer/sourceless/nothing';
import { Nothing as NothingSource } from './source/nothing';

export class App {
    lights: Light[] = [];
    private transformer: Transformer = new NothingTransformer();
    private source: Source = new NothingSource();

    private bindings: Bindings = { transformers: {}, sources: {} } 

    setup(setupable: Setupable) {
        setupable.setup(this);
    }

    teardown(teardownable: Teardownable) {
        teardownable.teardown(this);
    }

    addLight(light: Light) {
        this.lights.push(light);
    }

    setTransformer(key: string) {
        const transformer = this.bindings.transformers[key];
        if (!transformer) throw new Error('Transformer ' + key + ' not found');

        const oldTransformer = this.transformer;
        this.transformer = new NothingTransformer();
        oldTransformer.teardown(this);
        
        transformer.setup(this);
        this.transformer = transformer;
    }

    bindTransformer(transformer: Transformer) {
        this.bindings.transformers[transformer.key] = transformer;
    }

    setSource(key: string) {
        const source = this.bindings.sources[key];
        if (!source) throw new Error('Source ' + key + ' not found');

        const oldSource = this.source;
        this.source = new NothingSource();
        oldSource.teardown(this);
        
        source.setup(this);
        this.source = source;
    }

    bindSource(source: Source) {
        this.bindings.sources[source.key] = source;
    }

    startServer() {
        const app = express();

        app.get('/', (req, res) => {
            this.setTransformer(req.query.transformer as string);
            res.send({ source: this.source.key, transformer: this.transformer.key });
        });

        app.listen(4000, () => {
            console.log(`Server started at http://localhost:4000`);
        });
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

interface HSBKColor {
    hue: number;
    saturation: number;
    brightness: number;
    kelvin?: number;
}

type Waveform = 'SAW' | 'SINE' | 'HALF_SINE' | 'TRIANGLE' | 'PULSE';

export interface Light {
    setColor(params: { color: HSBKColor, duration?: number, callback?: () => void }): void;
    setWaveform(params: { fromColor?: HSBKColor, toColor: HSBKColor, transient: boolean, period: number, cycles: number, skewRatio: number, waveform: Waveform, callback?: () => void }): void;
}

export interface Source extends Setupable, Teardownable {
    key: string;
}

export interface Transformer extends Setupable, Teardownable {
    key: string;
    handleBeat: () => void;
}