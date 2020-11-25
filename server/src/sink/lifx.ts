import { Client as LifxClient, Light as LifxLight } from 'node-lifx';
import { App, Light } from '../app';

export class Lifx {
    private client: LifxClient;

    setup(app: App) {
        this.client = new LifxClient();
        this.client.init();

        this.client.on('light-new', (light) => {
            app.addLight(transformLight(light));
        })
    }

    teardown(app: App) {
        this.client.destroy();
    }
}

const transformLight = (lifxLight: LifxLight): Light => ({
    set: ({ hue, saturation, brightness, duration }, callback) => {
        lifxLight.color(hue, saturation, brightness, undefined, duration, callback);
    }
})