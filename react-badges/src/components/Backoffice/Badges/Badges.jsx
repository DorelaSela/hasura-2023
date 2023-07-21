import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  DELETE_BADGE
} from "../../../containers/state/BadgesQueries";
import { Box, Button, Card, Typography, Fab } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";

const Badges = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(LOAD_BADGES);
  const { id: badgeId } = useParams();
  // const badge = data.badges_versions_last.find(
  //   (badge) => badge.id === parseInt(id)
  // );
  const [badges, setBadges] = useState([]);
  const [deleteBadge, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_BADGE);

  useEffect(() => {
    if (data) {
      setBadges(data.badges_versions_last || []);
    }
  }, [data]);

  const deleteBadgeHandler = (badgeId) => {
    deleteBadge({
      variables: {
        badge_def_id: badgeId
      },
      refetchQueries: [{ query: LOAD_BADGES }]
    })
      .then((result) => {
        console.log(
          "Badge deleted successfully:",
          result.data.create_badge_version
        );
      })
      .catch((error) => {
        console.error("Error deleting badge:", error);
      });
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Box>
        {badges &&
          badges.map((badge, index) => {
            console.log(badge);
            return (
              <Card
                key={index}
                sx={{
                  padding: "16px",
                  marginBottom: "16px",
                  marginTop: "16px",
                  marginLeft: "16px",
                  marginRight: "16px"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    justifyContent: "space-evenly"
                  }}
                >
                  <Typography variant="h1"> {badge.title}</Typography>
                  <Typography>{badge.description}</Typography>
                  {/* <ol>
                {badge.requirements.map((requirement, index) => (
                  <li key={index}>{requirement.description}</li>
                ))}
              </ol> */}
                </Box>
                <Button onClick={() => deleteBadgeHandler(badge.id)}>
                  Delete
                </Button>
                <Button onClick={() => handleEditClick(badge.id)}>Edit</Button>
              </Card>
            );
          })}
        <Fab
          component={Link}
          to="/create"
          color="primary"
          aria-label="add"
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px"
          }}
        >
          <h1>+</h1>
        </Fab>
      </Box>
    </div>
  );
};

export default Badges;
