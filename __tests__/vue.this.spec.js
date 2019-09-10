import Vue from "vue";
import VueEvent from "./../src";
import { produceEvent, eventConsumer } from './../src/event';

Vue.use(VueEvent);

describe('Vue.$event on this', () => {
    let vueModel;
    
    beforeEach(() => {
        vueModel = new Vue({
            data(){
                return { count: 0, letter: '' };
            },
            created(){
                this.$event.on(eventConsumer({
                    type: 'FSA_ADD',
                    consume: ({ error, payload, meta }) => {
                        this.count = this.count + payload.add;
                        this.letter = this.letter + meta.letter;    
                    }
                }));

                this.$event.on(eventConsumer({
                    type: 'FSA_DOUBLE',
                    consume: ({ error, payload, meta }) => {
                        this.count = this.count * 2;
                    }
                }));

                this.$event.once(eventConsumer({
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
                emitOnce(){
                    this.$event.emit(produceEvent({
                        type: 'FSA_ADD_ONCE',
                        payload: {
                            add: 1
                        },
                        error: null,
                        meta: {
                            letter: 'bbb'
                        }
                    }));
                },
                on(eventConsumer){
                    return this.$event.on(eventConsumer);
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
        vueModel.emit();

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');

        vueModel.emit();

        expect(vueModel.count).toBe(2)
        expect(vueModel.letter).toBe('aaaaaa');
    });

    test('trigger once event by emit', () => {
        expect(vueModel.count).toBe(0);
        expect(vueModel.letter).toBe('');
        expect(vueModel.show().eventTypes.length).toBe(3);

        vueModel.emit();
        
        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
        expect(vueModel.show().eventTypes.length).toBe(3);

        vueModel.emitOnce();

        expect(vueModel.count).toBe(2)
        expect(vueModel.letter).toBe('aaabbb');
        expect(vueModel.show().eventTypes.length).toBe(2);

        vueModel.emitOnce();
        
        expect(vueModel.count).toBe(2)
        expect(vueModel.letter).toBe('aaabbb');
        expect(vueModel.show().eventTypes.length).toBe(2);
    });

    test('off remove event', () => {
        vueModel.emit();

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');

        vueModel.off({ type: 'FSA_ADD' })

        vueModel.emit();

        expect(vueModel.count).toBe(1)
        expect(vueModel.letter).toBe('aaa');
    });

    test('clear remove store', () => {
        expect(vueModel.show().eventTypes.length).toBe(3);

        vueModel.clear();

        expect(vueModel.show().eventTypes.length).toBe(0);

        vueModel.on(eventConsumer({
            type: 'FSA_TRIPLE',
            consume: ({ error, payload, meta }) => {
                this.count = this.count * 3;
            }
        }));

        expect(vueModel.show().eventTypes.length).toBe(1);
    });
});
