import Vue from "vue";
import VueEvent from "./../src";
import { produceEvent, eventConsumer } from './../src/event';

Vue.use(VueEvent);

describe('Vue.$event on Vue', () => {
    let vueModel;
    
    beforeEach(() => {
        vueModel = new Vue({
            data(){
                return { count: 0, letter: '' };
            },
            created(){
                Vue.$event.on(eventConsumer({
                    type: 'FSA_ADD',
                    consume: ({ error, payload, meta }) => {
                        this.count = this.count + payload.add;
                        this.letter = this.letter + meta.letter;    
                    }
                }));

                Vue.$event.on(eventConsumer({
                    type: 'FSA_DOUBLE',
                    consume: ({ error, payload, meta }) => {
                        this.count = this.count * 2;
                    }
                }));

                Vue.$event.once(eventConsumer({
                    type: 'FSA_ADD_ONCE',
                    consume: ({ error, payload, meta }) => {
                        this.count = this.count + payload.add;
                        this.letter = this.letter + meta.letter;
                    }
                }));
            },
            methods: {
                emit(){
                    this.$event.emit(produceEvent({
                        type: 'FSA_ADD',
                        payload: {
                            add: 1
                        },
                        error: null,
                        meta: {
                            letter: 'aaa'
                        }
                    }));
                },
                off({ type }) {
                    return this.$event.off({ type });
                },
                show(){
                    return this.$event.show();
                },
                clear(){
                    return this.$event.clear();
                },
                find({ type }){
                    return this.$event.find({ type })
                }
            }
        });
    });

    test('trigger on event by emit', () => {
        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'aaa'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'bbb'
            }
        }));

        expect(vueModel.count).toBe(2)
        expect(vueModel.letter).toBe('aaabbb');
    });

    test('trigger once event by emit', () => {
        expect(vueModel.count).toBe(0);
        expect(vueModel.letter).toBe('');
        expect(Vue.$event.show().eventTypes.length).toBe(3);

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD_ONCE',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'aaa'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
        expect(Vue.$event.show().eventTypes.length).toBe(2);

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD_ONCE',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'bbb'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
        expect(Vue.$event.show().eventTypes.length).toBe(2);

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD_ONCE',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'bbb'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
        expect(Vue.$event.show().eventTypes.length).toBe(2);
    });

    test('off remove event', () => {
        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'aaa'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');

        Vue.$event.off({ type: 'FSA_ADD' })

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'bbb'
            }
        }));

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
    });

    test('clear remove store', () => {
        Vue.$event.clear();

        Vue.$event.emit(produceEvent({
            type: 'FSA_ADD',
            payload: {
                add: 1
            },
            error: null,
            meta: {
                letter: 'aaa'
            }
        }));

        expect(vueModel.count).toBe(0)
        expect(vueModel.letter).toBe('');
        expect(Vue.$event.show().eventTypes.length).toBe(0);
    });
});
