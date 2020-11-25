import { App } from './app';
import { Lifx } from './sink/lifx'
import { Bpm } from './source/bpm';
import { RainbowBeats } from './transformer/rainbowBeats';
import { Nothing } from './transformer/sourceless/nothing'
import { Rainbow } from './transformer/sourceless/rainbow'
import { Strobe } from './transformer/sourceless/strobe';

const app = new App();

app.setup(new Lifx());

app.bindTransformer(new Nothing());
app.bindTransformer(new Rainbow());
app.bindTransformer(new Strobe());
app.bindTransformer(new RainbowBeats());
app.setTransformer(Rainbow.key);

app.bindSource(new Bpm());

app.startServer();