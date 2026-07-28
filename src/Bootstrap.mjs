// @ts-check

/**
 * @namespace TeqFw_Log_Bootstrap
 * @description Public composition-root API for creating a console-backed logging provider.
 */

/**
 * Creates the reference logging provider for a composition root.
 *
 * With no options it uses the reference console writer. When `writers` is
 * supplied, every writer receives records in declaration order; shutdown runs
 * in reverse declaration order. The returned shutdown function is safe to call
 * from a finally block because individual writer failures are contained.
 *
 * @param {TeqFw_Log_Bootstrap_Options} options
 * @returns {Promise<TeqFw_Log_Bootstrap_Result>}
 */
export async function createBootstrap(options = {}) {
    if ((options === null) || (typeof options !== 'object') || Array.isArray(options)) {
        throw new Error('Logger bootstrap options must be an object.');
    }
    const {writers} = options;
    if ((writers !== undefined) && !Array.isArray(writers)) {
        throw new Error('Logger bootstrap writers must be an array when provided.');
    }

    const [providerModule, levelModule, loggerModule, factoryModule, consoleWriterModule, aggregateModule] = await Promise.all([
        import('./Provider.mjs'),
        import('./Enum/Level.mjs'),
        import('./Logger.mjs'),
        import('./Record/Factory.mjs'),
        import('./Console/Writer.mjs'),
        import('./Writer/Aggregate.mjs'),
    ]);
    const configuredWriters = writers ?? [new consoleWriterModule.default()];
    const writer = new aggregateModule.default({writers: configuredWriters});
    const provider = new providerModule.default({
        levels: {default: levelModule.default},
        loggerModule: loggerModule.default,
        recordFactory: new factoryModule.default(),
        writer,
    });
    return Object.freeze({
        provider,
        shutdown: () => writer.shutdown(),
    });
}

export default createBootstrap;
