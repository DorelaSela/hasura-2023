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
  mutation MyMutation($id: Int!, $is_deleted: Boolean!) {
    create_badge_version(args: { badge_def_id: $id, is_deleted: $is_deleted }) {
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
