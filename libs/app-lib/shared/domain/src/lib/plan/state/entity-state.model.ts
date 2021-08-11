// import produce from 'immer';

// export interface EntityState<T = any, idType = string> {
//   entities: { [key: string]: T };
//   id: idType[];
// }

// export class EntityAdapter<T> {
//   static removeEntity(key: string, state: EntityState) {

//     const updatedState = produce(state, (draft) => {
//       delete draft.entities[key];
//       draft.id = draft.id.filter((id) => id !== key);
//       return draft;
//     })

//     return updatedState;
//   }

//   static addEntity(entity: T, state: EntityState) {
//     state.
//   }
// }

// export const initialEntityState: EntityState<any> = { entities: {}, id: [] };
