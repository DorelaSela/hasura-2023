import { gql } from "@apollo/client";

export const DELETE_MANAGER = gql`
  mutation DeleteManager($id: Int!) {
    update_managers(where: { id: { _eq: $id } }, _set: { is_deleted: true }) {
      returning {
        is_deleted
        name
      }
    }
  }
`;

export const ADD_MANAGER = gql`
  mutation AddManager($name: String!) {
    insert_users_one(
      object: { name: $name, roles: ["manager"], is_deleted: false }
    ) {
      is_deleted
      id
      name
    }
  }
`;

export const GET_ENGINEERS = gql`
  query getEngineers {
    engineers {
      id
      name
      is_deleted
    }
  }
`;

export const ADD_RELATION = gql`
  mutation addRelation($engineer: Int!, $manager: Int!) {
    insert_users_relations_one(
      object: { engineer: $engineer, manager: $manager }
    ) {
      manager
      engineer
      created_by
      created_at
    }
  }
`;

export const LOAD_MANAGERS = gql`
  query MyQuery {
    managers {
      id
      name
      is_deleted
    }
  }
`;

export const GET_ENGINEERS_BY_MANAGER = gql`
  mutation getEngineersByManager($id: Int!) {
    get_engineers_by_manager(args: { manager_id: $id }) {
      name
      id
    }
  }
`;

export const EDIT_MANAGER_NAME = gql`
  mutation editManagersName($id: Int!, $name: String!) {
    update_managers(where: { id: { _eq: $id } }, _set: { name: $name }) {
      returning {
        name
      }
    }
  }
`;

export const DELETE_RELATION = gql`
  mutation deleteRelations($idM: Int!, $idE: Int!) {
    delete_users_relations(
      where: { manager: { _eq: $idM }, engineer: { _eq: $idE } }
    ) {
      returning {
        manager
        engineer
      }
    }
  }
`;

export const GET_ENGINEER_TEAM = gql`
  query getEngineeringTeam($managerId : Int!){
    engineering_teams(where: {manager_id: {_eq: $managerId}}) {
      items
    }
  }
`;
