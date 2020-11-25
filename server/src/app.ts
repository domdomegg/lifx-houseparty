import express from 'express';
import { Nothing as NothingTransformer } from './transformer/sourceless/nothing';
import { Nothing as NothingSource } from './source/nothing';
import { Light, Source, Transformer, Sink, Bindings, Setupable, Teardownable } from './types';

export class App {
    lights: Light[] = [];
    private transformer: Transformer = new NothingTransformer();
    private source: Source = new NothingSource();

    private bindings: Bindings = { sources: {}, transformers: {}, sinks: {} } 

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

    enableSink(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const sink = this.bindings.sinks[key];
        if (!sink) throw new Error('Sink ' + key + ' not found');

        sink.setup(this);
    }

    disableSink(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const sink = this.bindings.sources[key];
        if (!sink) throw new Error('Sink ' + key + ' not found');

        sink.teardown(this);
    }

    bindSink(sink: Sink) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        this.bindings.sinks[sink.key] = sink;
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
