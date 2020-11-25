import { Client as LifxClient, Light as LifxLight } from 'lifx-lan-client';
import { Duplex } from 'stream';
import { App, Light } from '../app';

export class Lifx {
    private client: LifxClient;

    setup(app: App) {
        this.client = new LifxClient();
        this.client.init();

        this.client.on('light-new', (light) => {
            if (light.id == '***REMOVED***') {
                app.addLight(transformLight(light));
            }
        })
    }

    teardown(app: App) {
        this.client.destroy();
    }
}

const transformLight = (lifxLight: LifxLight): Light => ({
    setColor: ({ color: { hue, saturation, brightness, kelvin }, duration, callback }) => {
        lifxLight.color(hue, saturation, brightness, kelvin, duration, callback);
    },
    setWaveform: ({ fromColor, toColor, transient, period, cycles, skewRatio, waveform, callback }) => {
        const waveformId = {
            'SAW': 0,
            'SINE': 1,
            'HALF_SINE': 2,
            'TRIANGLE': 3,
            'PULSE': 4
        }[waveform] as 0 | 1 | 2 | 3 | 4;

        if (fromColor) {
            lifxLight.color(fromColor.hue, fromColor.saturation, fromColor.brightness, fromColor.kelvin, 0, () => {
                lifxLight.waveform(toColor.hue, toColor.saturation, toColor.brightness, toColor.kelvin, transient, period, cycles, skewRatio, waveformId, callback);
            })
        } else {
            lifxLight.waveform(toColor.hue, toColor.saturation, toColor.brightness, toColor.kelvin, transient, period, cycles, skewRatio, waveformId, callback);
        }
    }
})