import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  DELETE_BADGE
} from "../../../containers/state/BadgesQueries";
import { Box, Button, Card, Typography, Fab } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Badges = () => {
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState({});
  const [badges, setBadges] = useState([]);
  const [requirement, setRequirements] = useState([]);
  const [deleteBadge] = useMutation(DELETE_BADGE);
  const { data, loading, error } = useQuery(LOAD_BADGES);

  useEffect(() => {
    if (data && data?.badges_versions_last) {
      const badgesWithRequirements = data?.badges_versions_last?.map(
        (badge) => {
          const requirements = JSON.parse(badge?.requirements);
          return {
            ...badge,
            requirements: requirements
          };
        }
      );
      setBadges(badgesWithRequirements || []);

      const initialVisibility = {};
      badgesWithRequirements.forEach((badge) => {
        initialVisibility[badge.id] = false;
      });
      setShowRequirements(initialVisibility);
    }
  }, [data, data?.badges_versions_last]);

  const deleteBadgeHandler = (badgeId) => {
    deleteBadge({
      variables: {
        badge_def_id: badgeId
      },
      refetchQueries: [{ query: LOAD_BADGES }]
    })
      .then((result) => {
        console.log("Badge deleted successfully:");
      })
      .catch((error) => {
        console.error("Error deleting badge:", error);
      });
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  };

  const toggleRequirements = (id) => {
    setShowRequirements((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
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
          badges?.map((badge, index) => {
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
                </Box>
                <Button onClick={() => deleteBadgeHandler(badge.id)}>
                  Delete
                </Button>
                <Button onClick={() => handleEditClick(badge.id)}>Edit</Button>
                <Button onClick={() => toggleRequirements(badge.id)}>
                  {requirement[badge.badgeId]
                    ? "Hide Requirements"
                    : "Show Requirements"}
                </Button>
                {showRequirements[badge.id] && (
                  <div>
                    <Typography variant="h2">Requirements:</Typography>
                    <ul>
                      {badge.requirements
                        ?.sort((a, b) => a.id - b.id) // Sort the requirements by requirement.id
                        .map((requirement, index) => (
                          <li key={index}>
                            <Typography>{requirement.title}</Typography>
                            <Typography>{requirement.description}</Typography>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
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
