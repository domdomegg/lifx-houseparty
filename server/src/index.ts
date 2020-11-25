import { App } from './app';
import { Lifx } from './sink/lifx'
import { Bpm } from './source/bpm';
import { SpotifyBeats } from './source/spotifybeats';
import { RainbowBeats } from './transformer/rainbowBeats';
import { Nothing } from './nothing'
import { Rainbow } from './transformer/sourceless/rainbow'
import { Strobe } from './transformer/sourceless/strobe';

const app = new App();

app.bindSink(new Lifx());

app.bindTransformer(new Nothing());
app.bindTransformer(new Rainbow());
app.bindTransformer(new Strobe());
app.bindTransformer(new RainbowBeats());

app.bindSource(new Nothing());
app.bindSource(new Bpm());
app.bindSource(new SpotifyBeats());

app.enableSink(Lifx.key);
app.setTransformer(RainbowBeats.key);
app.setSource(Bpm.key);

app.startServer();