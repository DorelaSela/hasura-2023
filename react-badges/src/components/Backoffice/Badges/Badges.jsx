import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  LOAD_BADGES,
  DELETE_BADGE
} from "../../../containers/state/BadgesQueries";
import { Box, Button, Card, Typography, Fab, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Badges = () => {
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState({});
  const [badges, setBadges] = useState([]);
  const [requirement, setRequirements] = useState([]);
  const [deleteBadge] = useMutation(DELETE_BADGE);
  const { data, loading, error } = useQuery(LOAD_BADGES);
  const [areRequirementsEmpty, setAreRequirementsEmpty] = useState(false);
  const [allBadgesDeleted, setAllBadgesDeleted] = useState(false);

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

      if (badgesWithRequirements.length === 0) {
        setAllBadgesDeleted(true);
      } else {
        setAllBadgesDeleted(false);
      }
    } else {
      setAllBadgesDeleted(true);
    }
  }, [data, data?.badges_versions_last]);

  const deleteBadgeHandler = (badgeId) => {
    deleteBadge({
      variables: {
        badge_def_id: badgeId
      },
      refetchQueries: [{ query: LOAD_BADGES }]
    })
      .then(() => {
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
    const badgeRequirements = badges.find(
      (badge) => badge.id === id
    )?.requirements;
    if (!badgeRequirements || badgeRequirements.length === 0) {
      setAreRequirementsEmpty(true);
    } else {
      setShowRequirements((prevState) => ({
        ...prevState,
        [id]: !prevState[id]
      }));
      setRequirements((prevState) => ({
        ...prevState,
        [id]: !prevState[id]
      }));
      setAreRequirementsEmpty(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      flexBasis="50%"
    >
      {allBadgesDeleted && (
        <Alert variant="outlined" severity="info">
          There are no badges available.
        </Alert>
      )}
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
                width: "55%",
                marginRight: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center" // Center the items inside the card
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                gap="8px"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h1"> {badge.title}</Typography>
                <Typography>{badge.description}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                gap="8px"
                marginTop="16px"
              >
                <Button
                  onClick={() => deleteBadgeHandler(badge.id)}
                  variant="outlined"
                  color="secondary"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleEditClick(badge.id)}
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => toggleRequirements(badge.id)}
                  variant="outlined"
                  color="primary"
                >
                  {requirement[badge.id]
                    ? "Hide Requirements"
                    : "Show Requirements"}
                </Button>
              </Box>
              {showRequirements[badge.id] && (
                <div>
                  <Typography variant="h2">Requirements:</Typography>
                  <ol>
                    {badge.requirements
                      ?.sort((a, b) => a.id - b.id) // Sort the requirements by requirement.id
                      .map((requirement, index) => (
                        <li key={index}>
                          <Typography>{requirement.title}</Typography>
                          <Typography>{requirement.description}</Typography>
                        </li>
                      ))}
                  </ol>
                  {areRequirementsEmpty && (
                    <Alert variant="outlined" severity="info">
                      There are no requirements for this badge.
                    </Alert>
                  )}
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
  );
};

export default Badges;
