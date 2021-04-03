import { gql } from 'apollo-server-express';

export const goalSchema = gql`
  type Goal {
    id: ID
    name: String
    scheduledDate: String
    type: String
    completed: Boolean
  }
`;

export const goalQuerySchema = `
    goals(scheduledDate: String): [Goal]
`;
