import { Injectable } from "@angular/core";
import { Observable, Observer, Subscription } from "rxjs";
import { filter, map, share } from "rxjs/operators";
import { AppEvent } from "../../models/events.model";

export interface EventWithContent<T> {
  name: AppEvent;
  content: T;
}

/**
 * A utility class to manage RX events.
 *
 * See https://github.com/jhipster/ng-jhipster/blob/master/src/service/event-manager.service.ts
 */
@Injectable({
  providedIn: "root",
})
export class AppEventManager {
  observable: Observable<EventWithContent<any>>;
  observer!: Observer<EventWithContent<any>>;

  constructor() {
    this.observable = new Observable((observer: Observer<EventWithContent<any>>) => {
      this.observer = observer;
    }).pipe(share());
  }

  /**
   * Method to broadcast the event to observer
   */
  broadcast<T = any>(event: EventWithContent<T>): void {
    if (this.observer) {
      this.observer.next(event);
    }
  }

  /**
   * Method to subscribe to an event with callback
   */
  subscribe<T>(eventName: string, callback: (content: T) => void): Subscription {
    return this.observable
      .pipe(
        filter((event: EventWithContent<any>) => event.name === eventName),
        map((event: EventWithContent<any>) => event.content),
      )
      .subscribe((value) => {
        try {
          callback(value);
        } catch (error) {
          console.error(`Error occurred while handling next value of event "${eventName}"`, error);
        }
      });
  }
}
