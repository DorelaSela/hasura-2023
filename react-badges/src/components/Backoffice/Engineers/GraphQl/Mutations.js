import { gql } from "@apollo/client";

export const CREATE_ENGINEERS_MUTATION = gql`
  mutation CreateEngineer($name: String!) {
    insert_users_one(object: { name: $name, roles: ["engineer"] }) {
      id
      name
    }
  }
`;

export const DELETE_ENGINEERS = gql`
  mutation DeleteEngineers($id: Int!) {
    deleteRelationManager: delete_users_relations(
      where: { manager: { _eq: $id } }
    ) {
      affected_rows
    }
    deleteRelationEngineer: delete_users_relations(
      where: { engineer: { _eq: $id } }
    ) {
      affected_rows
    }
    delete_users(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
