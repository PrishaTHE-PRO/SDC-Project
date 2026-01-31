
// This is a simple event emitter to decouple error reporting from error handling.
// Components can emit errors, and a central listener can handle them.

type EventHandler = (...args: any[]) => void;

type EventMap = {
  'permission-error': (error: Error) => void;
};

class ErrorEmitter<Events extends Record<string, EventHandler>> {
  private listeners: { [K in keyof Events]?: Events[K][] } = {};

  on<K extends keyof Events>(event: K, listener: Events[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(...args));
    }
  }
}

export const errorEmitter = new ErrorEmitter<EventMap>();
