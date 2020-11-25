import { App, Transformer } from '../../app';

export class Nothing implements Transformer {    
    static key: string = 'nothing';
    key: string = Nothing.key;

    handleBeat() {}
    setup(app: App) {}
    teardown(app: App) {}
}