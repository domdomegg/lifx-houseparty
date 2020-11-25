import { App, Source } from '../types';

export class Nothing implements Source {
    key: string = 'nothing';

    setup(app: App) {}
    teardown(app: App) {}
}