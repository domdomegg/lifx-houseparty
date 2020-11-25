const client = require('node-lifx-lan');
import { App, Light } from '../app';

export class Lifx {
    setup(app: App) {
        client.discover({ wait: 5000 }).then((devices: any[]) => {
            devices.forEach(device => {
                app.addLight(transformLight(device));
            })
        });
    }

    teardown(app: App) {
    }
}

const transformLight = (lifxLight: any): Light => ({
    type: 'node-lifx-lan',
    raw: lifxLight,
    set: ({ hue, saturation, brightness, duration }, callback) => {
        const payload: any = { color: { hue: hue / 360, saturation: saturation / 100, brightness: brightness / 100 }};
        if (duration) payload.duration = duration;

        if (callback) {
            lifxLight.setColor(payload).then(() => callback());
        } else {
            lifxLight.setColor(payload);
        }
    }
})