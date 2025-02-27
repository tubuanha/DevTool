import type { Message } from 'discord.js';
import {
    BrainfuckEvaluationSystem,
    JavaEvaluationSystem,
    JavaScriptEvaluationSystem,
    KotlinEvaluationSystem,
    PythonEvaluationSystem,
    TypeScriptEvaluationSystem,
} from '../evaluation';

const codeBlockRegex = /^`{3}(?<lang>[a-z]+)\n(?<code>[\s\S]+)\n`{3}$/mu;

export async function run(message: Message): Promise<void> {
    for (const content of parseContent(message.content)) {
        if (!codeBlockRegex.test(content)) return;

        const codeblock = codeBlockRegex.exec(content)?.groups ?? {};
        switch (codeblock.lang?.toLowerCase()) {
            case 'js':
            case 'javascript':
                await message.reply(await new JavaScriptEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            case 'ts':
            case 'typescript':
                await message.reply(await new TypeScriptEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            case 'py':
            case 'python':
                await message.reply(await new PythonEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            case 'java':
                await message.reply(await new JavaEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            case 'kt':
            case 'kotlin':
                await message.reply(await new KotlinEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            case 'brainfuck':
                await message.reply(await new BrainfuckEvaluationSystem().evaluate(codeblock.code ?? ''));
                break;

            default:
                await message.reply([
                    `現在この言語はまだ未対応です: \`${codeblock.lang}\``,
                    '一緒に開発してくれる方を募集しています',
                    `\`${codeblock.lang}\` が実行できるようにあなたの手で対応しませんか？`,
                ].join('\n'));
                break;
        }
    }
}

function parseContent(content: string): string[] {
    const parse = content.split(/(?:`{3}(`{3})`{3}|(`{3}))/g).filter(s => s);
    const sort: string[] = [];
    for (const p of parse) {
        sort.push(sort[sort.length - 1]?.lastIndexOf('```') === 0 ? `${sort.pop()}${p}` : p);
    }
    const purge = sort.filter(s => s.startsWith('```'));
    return purge;
}
