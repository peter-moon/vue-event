
import { isFSA } from 'flux-standard-action';

/**
 * Event Must be Conformed Flux Standard Action TYPE
 * detail here: https://github.com/redux-utilities/flux-standard-action
 * @param {Flux Standard Action} fsa 
 */
export const isConformedEvent = (fsa = { type, payload, error, meta }) => {
    return isFSA(fsa);
};

export const produceEvent = (fsa = { type, payload, error, meta }) => {
    if(!isConformedEvent(fsa)){
        throw new Error('MUST BE CONFORMED FLUX STANDARD ACTION');
    }
    
    return {
        ...fsa
    }
};

export const eventConsumer = ({ type, consume }) => {
    if(!type || !consume) {
        throw new Error('NEEDS TYPE, CONSUME');
    }

    return { type, consume }
};

