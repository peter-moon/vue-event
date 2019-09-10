import { eventConsumer } from './../src/event';
import { registEventConsumer, unregistEventByType, findEventByType, clearEventStoreAll, showEventStore } from './../src/store';

describe('store', () => {

	const EVENT_TYPE = 'FSA_STANDARD';
	const NOT_REGISTERED_EVENT_TYPE = 'NOT_REGISTERED_EVENT_TYPE';

	beforeEach(() => {
		clearEventStoreAll();
		
		const eventConsume = eventConsumer({
			type: EVENT_TYPE,
			consume: ({ error, payload, meta }) => {
				
			}
		});

		registEventConsumer(eventConsume);
	});

	describe('resigt event consumer', () => {

		test('invalid event consumer throw error', () => {
			expect(() => {
				const eventConsume = eventConsumer({
					type: EVENT_TYPE
				});
	
				registEventConsumer(eventConsume);
			}).toThrow(Error)
		});
	
		test('valid event consumer', () => {
			const event = eventConsumer({
				type: EVENT_TYPE,
				consume({ error, payload, meta }) {
					
				}
			});

			registEventConsumer(event);
		});
	});

	test('can show store by showEventStore', () => {
		const store = showEventStore();
		const hasTestEventType = store.eventTypes.includes(EVENT_TYPE);

		expect(hasTestEventType).toEqual(true);
	});

	test('clearEventStoreAll clear store', () => {
		clearEventStoreAll();

		const clearedStore = showEventStore();
		expect(clearedStore.hasEvent).toEqual(false);
	});
	
	describe('can find event by type', () => {
		test('can not find not registered event', () => {
			const findedEvent = findEventByType({ type: NOT_REGISTERED_EVENT_TYPE });
			expect(findedEvent).toEqual(null);
		});

		test('find registered event', () => {
			const findedEvent = findEventByType({ type: EVENT_TYPE });
			expect(findedEvent.type).toEqual(EVENT_TYPE);
		});
	});

	describe('can unregist event by type', () => {
		test('can not unregist not registered event', () => {
			const unregist = unregistEventByType({ type: NOT_REGISTERED_EVENT_TYPE });
			expect(unregist.result).toEqual(false);
		});

		test('unregist registered event', () => {
			const unregist = unregistEventByType({ type: EVENT_TYPE });
			expect(unregist.result).toEqual(true);
		});
	});
});
