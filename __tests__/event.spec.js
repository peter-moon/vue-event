import { produceEvent, eventConsumer } from './../src/event';

describe('event', () => {
    test('event must be conformed Flux Standard Action', () => {
		const STANDARD_FSA_EVENT = produceEvent({
			type: 'FSA_STANDARD',
			payload: {
				hello: 'world'
			},
			error: false,
			meta: {
				uid: 0
			}
		});

		expect(STANDARD_FSA_EVENT.type).toEqual('FSA_STANDARD');
		expect(STANDARD_FSA_EVENT.payload.hello).toEqual('world');
		expect(STANDARD_FSA_EVENT.error).toEqual(false);
		expect(STANDARD_FSA_EVENT.meta.uid).toEqual(0);
	});

	test('non fsa throw error', () => {
		expect(() => {
			const NONE_STANDARD_FSA_EVENT = produceEvent({
				payload: {
					hello: 'world'
				}
			});
		}).toThrow(Error);
	});
});
