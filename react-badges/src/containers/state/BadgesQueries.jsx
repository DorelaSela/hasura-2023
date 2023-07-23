import { gql } from "@apollo/client";

export const LOAD_BADGES = gql`
  query LoadBadges {
    badges_versions_last(where: { is_deleted: { _eq: false } }) {
      title
      requirements
      description
      id
    }
  }
`;

export const CREATE_BADGE_MUTATION = gql`
  mutation MyMutation(
    $title: String!
    $description: String!
    $requirementTitle: String!
    $requirementDescription: String!
  ) {
    insert_badges_definitions(
      objects: {
        description: $description
        title: $title
        badges_definitions_requirements_definitions: {
          data: {
            title: $requirementTitle
            description: $requirementDescription
          }
        }
      }
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
    create_badge_version(args: { badge_def_id: $id, is_deleted: false }) {
      title
      id
      requirements
    }
  }
`;
export const DELETE_BADGE = gql`
  mutation deleteBadge($badge_def_id: Int!) {
    create_badge_version(
      args: { badge_def_id: $badge_def_id, is_deleted: true }
    ) {
      id
      is_deleted
    }
  }
`;

export const EDIT_BADGE = gql`
  mutation EditBadge($id: Int!, $title: String!, $description: String!) {
    update_badges_definitions(
      where: { id: { _eq: $id } }
      _set: { description: $description, title: $title }
    ) {
      affected_rows
    }
    create_badge_version(args: { badge_def_id: $id, is_deleted: false }) {
      id
    }
  }
`;

export const LOAD_BADGE = gql`
  query MyQuery($id: Int!) {
    badges_versions_last(where: { id: { _eq: $id } }) {
      title
      description
      id
    }
  }
`;
