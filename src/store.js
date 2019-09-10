const __STORE__ = {};

export const registEventConsumer = ({ type, consume, once = false }) => {
    if(!type){
        throw new Error('NEEDS TYPE');
    }

    if(!consume){
        throw new Error('NEEDS CONSUME');
    }

    __STORE__[type] = Object.assign({}, { type, consume, once });

    return { result: true };
}

export const unregistEventByType = ({ type }) => {
    const findedEvent = __STORE__[type];

    if(!findedEvent){
        return { result: false };
    }
    
    delete __STORE__[type];

    return { result: true };
}

export const findEventByType = ({ type }) => {
    const findedEvent = __STORE__[type];

    if(!findedEvent){
        return null;
    }

    return { ...findedEvent };
}

export const clearEventStoreAll = _ => {
    for (const key of Object.keys(__STORE__)) {
        delete __STORE__[key];
    }
}

const getMirroredEventStore = _ => {
    return { ...__STORE__ };
}

export const showEventStore = () => {
    const eventConsumers = getMirroredEventStore();

    const keys = Object.keys(eventConsumers);
    const hasEvent = keys.length > 0;
    const eventTypes = [...keys];

    return { hasEvent, eventTypes, eventConsumers };
}