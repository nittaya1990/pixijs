// need to be able to generate multiple index entry files
// e.g. main, webworker, node, etc.

import { readJSONSync, writeJSONSync } from 'fs-extra';

// sub imports can be generated by finding `init` files? or should it just be a manual list?
const subImports = [
    ['./accessibility', './lib/accessibility'],
    ['./advanced-blend-modes', './lib/filters/blendModes'],
    ['./app', './lib/app'],
    ['./assets', './lib/assets'],
    // 'compressed-textures', // to be implemented
    // 'basis', // to be implemented
    ['./events', './lib/events'],
    // ['./math-extras', './lib/math-extras'],
    // ['./graphics', './lib/scene/graphics'],
    // ['./mesh', './lib/scene/mesh'],
    // ['./prepare', './lib/prepare'], // to be implemented
    // ['./sprite-tiling', './lib/scene/sprite-tiling'],
    ['./spritesheet', './lib/spritesheet'],
    // ['./text', './lib/scene/text'], // should this be split out into canvas, html, bitmap?
    ['./rendering', './lib/rendering'], // rename to core?
    // 'unsafe-eval', // to be implemented
];

interface ExportField
{
    import: {
        default: string;
        types?: string;
    };
    require: {
        default: string;
        types?: string;
    };
}

const exportFields: Record<string, ExportField> = {
    '.': {
        import: {
            types: './lib/index.d.ts',
            default: './lib/index.mjs',
        },
        require: {
            types: './lib/index.d.ts',
            default: './lib/index.js',
        },
    },
    './browser': {
        import: {
            default: './lib/environment/browser/browserAll.mjs',
        },
        require: {
            default: './lib/environment/browser/browserAll.js',
        },
    },
    './webworker': {
        import: {
            default: './lib/environment/webworker/webworkerAll.mjs',
        },
        require: {
            default: './lib/environment/webworker/webworkerAll.js',
        },
    }
};
const sideEffects = [
    './lib/environment/browser/browserAll.*',
    './lib/environment/webworker/webworkerAll.*',
];

for (const [name, path] of subImports)
{
    exportFields[name] = {
        import: {
            default: `${path}/init.mjs`,
        },
        require: {
            default: `${path}/init.js`,
        },
    };
    sideEffects.push(`${path}/init.*`);
}

const pkg = readJSONSync('./package.json');

pkg.exports = exportFields;
pkg.sideEffects = sideEffects;

writeJSONSync('./package.json', pkg, { spaces: 2 });
