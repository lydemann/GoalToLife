import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { InboxState } from './inbox.model';

/**
 * Create initial state
 */
export function createInitialState(): InboxState {
  return {
    inboxGoalIds: [],
  };
}

/**
 * Inbox store
 *
 * @export
 * @class InboxStore
 * @extends {Store<InboxState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'inbox' })
export class InboxStore extends Store<InboxState> {
  constructor() {
    super(createInitialState());
  }
}
