import express from 'express';
import cors from 'cors';
import { Nothing } from './nothing';
import { Light, Source, Transformer, Sink, Bindings, Setupable, Teardownable } from './types';

export class App {
    lights: readonly Light[] = [];
    private transformer: Transformer = new Nothing();
    private source: Source = new Nothing();
    private sinks: Sink[] = [];

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

        (this.lights as Light[]).push(light);
        if (this.transformer.onLightConnect) this.transformer.onLightConnect(this, light);
    }

    removeLightsBySink(sink: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const lightsToRemove = this.lights.filter(light => light.createdBySink == sink);
        if (this.transformer.onLightDisconnect) lightsToRemove.forEach(light => this.transformer.onLightDisconnect(this, light));

        (this.lights as Light[]) = this.lights.filter(light => light.createdBySink !== sink);
    }

    setSource(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const source = this.bindings.sources[key];
        if (!source) throw new Error('Source ' + key + ' not found');

        const oldSource = this.source;
        this.source = new Nothing();
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
        this.transformer = new Nothing();
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
        this.sinks.push(sink);
    }

    disableSink(key: string) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const sink = this.bindings.sinks[key];
        if (!sink) throw new Error('Sink ' + key + ' not found');

        sink.teardown(this);
        this.sinks = this.sinks.filter(s => s.key !== key);
    }

    bindSink(sink: Sink) {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        this.bindings.sinks[sink.key] = sink;
    }

    startServer() {
        if (!(this instanceof App)) throw new Error('this is not an App, instead is ' + this);

        const app = express();
        const bodyParser = require('body-parser');
        app.use(cors());
        app.use(bodyParser.json());

        app.get('/', (req, res) => {
            res.send({
                bindingKeys: {
                    sources: Object.keys(this.bindings.sources),
                    transformers: Object.keys(this.bindings.transformers),
                    sinks: Object.keys(this.bindings.sinks)
                },
                source: this.source.key,
                transformer: this.transformer.key,
                sinks: this.sinks.map(s => s.key)
            })
        })

        app.put('/source', (req, res) => {
            this.setSource(req.body.key);
            res.send();
        });

        app.post('/source/data', (req, res) => {
            if (this.source.onData) this.source.onData(this, req.body);
            res.send();
        });

        app.put('/transformer', (req, res) => {
            this.setTransformer(req.body.key);
            res.send();
        });

        app.post('/transformer/data', (req, res) => {
            if (this.transformer.onData) this.transformer.onData(this, req.body);
            res.send();
        });

        app.put('/sink', (req, res) => {
            if (req.body.enabled) {
                this.enableSink(req.body.key)
            } else {
                this.disableSink(req.body.key);
            }
            res.send();
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
