import { gql } from "@apollo/client";

export const CREATE_ENGINEERS_MUTATION = gql`
  mutation MyMutation($name: String) {
    insert_engineers(name: $name) {
      id
    }
  }
`;
