import { registEventConsumer, unregistEventByType, findEventByType, clearEventStoreAll, showEventStore } from './store';

const VueEvent = {};

VueEvent.install = (Vue, options) => {
  const $event = new Vue();

  $event.on = function(eventConsumer) {
    const { type, consume } = eventConsumer;

    if(!type || !consume) {
      throw new Error('NEEDS TYPE, CONSUME');
    }

    if(!findEventByType({ type })){
      registEventConsumer(eventConsumer);
    }
    
    this.$on.bind(this)(type, consume);
  }

  $event.once = function(eventConsumer) {
    const { type, consume } = eventConsumer;

    if(!type || !consume) {
      throw new Error('NEEDS TYPE, CONSUME');
    }

    if(!findEventByType({ type })){
      registEventConsumer({ ...eventConsumer, once: true });  
    }

    this.$once.bind(this)(type, consume);
  }

  $event.emit = function({ type, payload, meta, error }) {
    this.$emit.bind(this)(type, { error, payload, meta });

    // unregist when event registered as once 
    const findedEvent = findEventByType({ type });
    
    if(findedEvent && findedEvent.once === true){
      unregistEventByType({ type });
    }
  }

  $event.off = function({ type }){
    this.$off.bind(this)(type);
    
    if(findEventByType({ type })){
      unregistEventByType({ type });
    }
  }

  $event.show = function(){
    return showEventStore();
  }

  $event.clear = function(){
    const { eventTypes } = this.show();
    
    // event off registered event type
    for(const type of eventTypes){
      this.off({ type });
    }

    clearEventStoreAll();
  }

  $event.find = function({ type }){
    return findEventByType({ type });
  }

  Object.defineProperty(Vue, '$event', {
    get() {
      return $event;
    }
  });

  Object.defineProperty(Vue.prototype, '$event', {
    get() {
      return $event;
    }
  });
};

export default VueEvent;