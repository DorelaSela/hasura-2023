import { gql } from "@apollo/client";

export const LOAD_ENGINEERS = gql`
  query MyQuery {
    engineers {
      id
      name
      is_deleted
    }
  }
`;

export const GET_MANAGERS = gql`
  query getManagers {
    managers {
      id
      name
    }
  }
`;
