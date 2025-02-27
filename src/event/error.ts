import type { DevToolBot } from '../DevToolBot';
import { Event } from '../interface';

export default class extends Event {
    public constructor(protected override readonly client: DevToolBot) {
        super(client, __filename);
    }

    public run(error: Error): void {
        this.logger.error('DJS Error -', error);
    }
}
