import { gql } from "@apollo/client";

export const LOAD_BADGES = gql`
  query LoadBadges {
    badges_versions_last(where: { is_deleted: { _eq: false } }) {
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
    create_badge_version(args: { badge_def_id: $id, is_deleted: false }) {
      title
      id
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
  mutation MyMutation(
    $badgeId: Int!
    $badgeTitle: String
    $badgeDescription: String
    $requirementId: Int
    $requirementTitle: String
    $requirementDescription: String
  ) {
    update_badges_definitions(
      where: { id: { _eq: $badgeId } }
      _set: { description: $badgeDescription, title: $badgeTitle }
    ) {
      affected_rows
    }
    update_requirements_definitions(
      where: { badge_id: { _eq: $badgeId }, id: { _eq: $requirementId } }
      _set: { description: $requirementDescription, title: $requirementTitle }
    ) {
      affected_rows
    }
    delete_requirements_definitions(
      where: { id: { _eq: $requirementId }, badge_id: { _eq: $badgeId } }
    ) {
      affected_rows
    }
    insert_requirements_definitions(
      objects: {
        badge_id: $badgeId
        title: $requirementTitle
        description: $requirementDescription
      }
    ) {
      affected_rows
    }
    create_badge_version(args: { badge_def_id: $badgeId, is_deleted: true }) {
      id
    }
  }
`;
