import { registEventConsumer, unregistEventByType, findEventByType, clearEventStoreAll, showEventStore } from './store';

const VueEvent = {};

VueEvent.install = (Vue, options) => {
  const $event = new Vue();

  $event.on = function(eventConsumer) {
    const { type, consume } = eventConsumer;

    if(!type || !consume) {
      console.warn('NEEDS TYPE, CONSUME');
      return;
    }

    if(!findEventByType({ type })){
      registEventConsumer(eventConsumer);  
    }
    
    this.$on.bind(this)(type, consume);
  }

  $event.once = function(eventConsumer) {
    const { type, consume } = eventConsumer;

    if(!type || !consume) {
      console.warn('NEEDS TYPE, CONSUME');
      return;
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
    return clearEventStoreAll();
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