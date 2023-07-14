import { gql } from "@apollo/client";

export const LOAD_BADGES = gql`
  query LoadBadges {
    badges_versions_last {
      title
      description
      id
    }
  }
`;
export const CREATE_BADGE_MUTATION = gql`
  mutation MyMutation($title: String!, $description: String!) {
    insert_badges_definitions(
      objects: { title: $title, description: $description }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const CREATE_BADGE_VERSION = gql`
  mutation MyMutation($id: Int!) {
    create_badge_version(args: { badge_def_id: $id }) {
      title
    }
  }
`;

export const DELETE_BADGE = gql`
  mutation MyMutation($id: Int!) {
    delete_requirements_definitions(
      where: { badges_definition: { id: { _eq: $id } } }
    ) {
      affected_rows
    }
    delete_badges_definitions(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
