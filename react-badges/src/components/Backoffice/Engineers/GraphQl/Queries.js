import { gql } from "@apollo/client";

export const LOAD_ENGINEERS = gql`
  query MyQuery {
    engineers {
      id
      name
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
