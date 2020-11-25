import { App, Source, Transformer } from './types';

export class Nothing implements Source, Transformer {    
    static key: string = 'nothing';
    key: string = Nothing.key;

    setup(app: App) {}
    teardown(app: App) {}
}