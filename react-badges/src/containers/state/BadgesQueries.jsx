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
      requirements
      id
    }
    requirements_definitions(where: { badge_id: { _eq: $id } }) {
      id
    }
  }
`;

export const UPDATE_REQUIREMENTS_MUTATION = gql`
  mutation UpdateRequirements(
    $badgeId: Int!
    $newDescription: String!
    $newTitle: String!
    $id: Int!
  ) {
    update_requirements_definitions_many(
      updates: [
        {
          where: { badge_id: { _eq: $badgeId }, id: { _eq: $id } }
          _set: { description: $newDescription, title: $newTitle }
        }
      ]
    ) {
      affected_rows
    }
  }
`;

export const LOAD_REQUIREMENT_ID = gql`
  query MyQuery($badge_id: Int!) {
    requirements_definitions(where: { badge_id: { _eq: $badge_id } }) {
      id
    }
  }
`;

const INSERT_REQUIREMENT_MUTATION = gql`
  mutation InsertRequirement(
    $description: String!
    $title: String!
    $badgeId: Int!
  ) {
    insert_requirements_definitions(
      objects: { description: $description, title: $title, badge_id: $badgeId }
    ) {
      affected_rows
      returning {
        badge_id
        description
        title
      }
    }
  }
`;

export const DELETE_REQUIREMENT = gql`
  mutation MyMutation($id: Int!) {
    delete_requirements_definitions(where: { badge_id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const CREATE_VERSION_AFTER = gql`
  mutation MyMutation($badge_def_id: Int!) {
    create_badge_version(
      args: { badge_def_id: $badge_def_id, is_deleted: false }
    ) {
      title
      id
    }
  }
`;
