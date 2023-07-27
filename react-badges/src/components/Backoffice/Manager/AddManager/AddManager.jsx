import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_MANAGER,
  ADD_RELATION,
  GET_ENGINEERS
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { LOAD_MANAGERS } from "../../../../containers/state/ManagersQueries";

const AddManagers = () => {
  const [name, setName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [engineerIds, setEngineerIds] = useState([]);
  const [error, setError] = useState(false);
  const [addManager, { data }] = useMutation(ADD_MANAGER);
  const [addRelation, { loading, error: relationError }] = useMutation(
    ADD_RELATION,
    {
      refetchQueries: [{ query: LOAD_MANAGERS }]
    }
  );
  const [id, setId] = useState(null);

  useEffect(() => {
    if (data && data.insert_users_one) {
      const managerId = data.insert_users_one.id;
      setId(managerId);
    }
  }, [data]);

  const steps = ["Create name", "Choose relation"];
  const r1 = useQuery(GET_ENGINEERS);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
    setError(false);
  };
  const handleAddManager = () => {
    if (!name) {
      setError(true);
    } else {
      addManager({
        variables: {
          name: name
        }
      }).then(() => {
        handleNext();
      });
    }
  };

  const handleCheckboxChange = (engineerId) => {
    if (engineerIds.includes(engineerId)) {
      setEngineerIds(engineerIds.filter((id) => id !== engineerId));
    } else {
      setEngineerIds([...engineerIds, engineerId]);
    }
  };

  const handleSubmit = () => {
    if (engineerIds.length > 0) {
      const uniqueEngineerIds = engineerIds.filter(
        (engineerId) =>
          !r1.data?.engineers?.some(
            (engineer) =>
              engineer.id === engineerId &&
              engineer?.relations?.some((relation) => relation.managerId === id)
          )
      );
      uniqueEngineerIds.forEach((engineerId) => {
        addRelation({
          variables: {
            manager: id,
            engineer: engineerId
          }
        });
      });

      navigate("/managers");
    } else {
      navigate("/managers");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (relationError) {
    return <p>Error: {error.message}</p>;
  }

  const renderForm = () => {
    if (activeStep === 0) {
      return (
        <Card
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              width: "400px",
              height: "200px"
            }}
          >
            <TextField
              type="text"
              label="Name"
              value={name}
              onChange={handleInputChange}
              error={error}
              helperText={error ? "Please enter a name" : ""}
            />
            <Button variant="contained" onClick={handleAddManager}>
              Next
            </Button>
          </CardContent>
        </Card>
      );
    } else if (activeStep === 1) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh"
          }}
        >
          <Card
            sx={{
              width: "30%",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CardContent>
              <Typography variant="h2">Available Engineers</Typography>
              {r1.data.engineers.map((record) => (
                <div key={record.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={engineerIds.includes(record.id)}
                        onChange={() => handleCheckboxChange(record.id)}
                        name={record.name}
                      />
                    }
                    label={record.name}
                  />
                </div>
              ))}
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    } else {
      alert("Success");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="28vh"
    >
      <Typography variant="h1" sx={{ marginBottom: "1rem" }}>
        Create Manager
      </Typography>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        sx={{ marginBottom: "16px", width: "80%" }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form>{renderForm()}</form>
    </Box>
  );
};

export default AddManagers;
