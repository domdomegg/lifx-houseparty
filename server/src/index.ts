import { App } from './app';
import { Lifx } from './sink/lifx'
import { Nothing } from './transformer/sourceless/nothing'
import { Rainbow } from './transformer/sourceless/rainbow'
import { Strobe } from './transformer/sourceless/strobe';

const app = new App();

app.setup(new Lifx());

app.bindTransformer(new Nothing());
app.bindTransformer(new Rainbow());
app.bindTransformer(new Strobe());
app.setTransformer(Rainbow.key);

app.startServer();