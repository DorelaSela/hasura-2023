import { gql } from "@apollo/client";

export const CREATE_ENGINEERS_MUTATION = gql`
  mutation CreateEngineer($name: String!) {
    insert_users_one(object: { name: $name, roles:["engineer"] }) {
      id
      name
    }
  }
`;
