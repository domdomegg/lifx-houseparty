import { App, Source } from '../app';

export class Nothing implements Source {
    key: string = 'nothing';

    setup(app: App) {}
    teardown(app: App) {}
}