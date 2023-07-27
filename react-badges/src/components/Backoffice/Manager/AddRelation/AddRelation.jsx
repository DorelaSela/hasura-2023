import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RELATION,
  GET_ENGINEERS,
  GET_ENGINEERS_BY_MANAGER
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";
import { useParams } from "react-router-dom";

const AddRelation = () => {
  const [engineerIds, setEngineerIds] = useState([]);
  const [addRelation] = useMutation(ADD_RELATION);
  const { id: managerId } = useParams();
  const navigate = useNavigate();

  const [
    getEngineersByManager,
    { data: teamsData, loading: teamsLoading, error: teamsError }
  ] = useMutation(GET_ENGINEERS_BY_MANAGER);

  useEffect(() => {
    getEngineersByManager({
      variables: { id: parseInt(managerId) }
    });
  }, []);

  const {
    data: engineersData,
    loading: engineersLoading,
    error: engineersError
  } = useQuery(GET_ENGINEERS);

  const handleCheckboxChange = (engineerId) => {
    if (engineerIds.includes(engineerId)) {
      setEngineerIds(engineerIds.filter((id) => id !== engineerId));
    } else {
      setEngineerIds([...engineerIds, engineerId]);
    }
  };

  const handleSubmit = () => {
    if (engineerIds.length > 0) {
      engineerIds.forEach((engineerId) => {
        if (managerId !== engineerId) {
          addRelation({
            variables: {
              manager: parseInt(managerId),
              engineer: engineerId
            }
          });
        }
      });
      navigate("/managers");
    } else {
      navigate("/managers");
      console.log("No engineer selected");
    }
  };

  if (teamsLoading || engineersLoading) {
    return <p>Loading...</p>;
  }

  if (teamsError || engineersError) {
    return <p>Error: {teamsError?.message || engineersError?.message}</p>;
  }

  const teams = teamsData?.get_engineers_by_manager;
  const engineers = engineersData?.engineers;
  const filteredEngineers = engineers?.filter((engineer) =>
    teams?.every((team) => team.id !== engineer.id)
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card sx={{ padding: "16px", width: "400px", textAlign: "center" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h2">Available Engineers</Typography>
          {filteredEngineers ? (
            filteredEngineers.map((record) => {
              const isDifferentManager = parseInt(managerId) !== record.id;
              if (!isDifferentManager) {
                return null;
              }
              return (
                <div key={record.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={engineerIds.includes(record.id)}
                        onChange={() => handleCheckboxChange(record.id)}
                      />
                    }
                    label={record.name}
                  />
                </div>
              );
            })
          ) : (
            <p>No engineers available</p>
          )}
          <Button onClick={handleSubmit} variant="contained" color="success">
            Submit
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRelation;
