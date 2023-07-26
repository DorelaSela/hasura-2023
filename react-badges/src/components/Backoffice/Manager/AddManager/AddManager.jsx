import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_MANAGER,
  ADD_RELATION,
  GET_ENGINEERS
} from "../../../../containers/state/ManagersQueries";
import { useNavigate } from "react-router-dom";
import {
  StepLabel,
  Step,
  Stepper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
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
          !r1.data.engineers.some(
            (engineer) =>
              engineer.id === engineerId &&
              engineer.relations.some((relation) => relation.managerId === id)
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
        <div>
          <TextField
            type="text"
            className="create-textfield"
            label="Name"
            value={name}
            onChange={handleInputChange}
            error={error}
            helperText={error ? "Please enter a name" : ""}
          />
          <Button
            variant="contained"
            onClick={handleAddManager}
            className="next-button"
          >
            Next
          </Button>
        </div>
      );
    } else if (activeStep === 1) {
      return (
        <div>
          <h2>Available Engineers</h2>
          {r1.data.engineers.map((record) => (
            <div key={record.id}>
              <input
                type="checkbox"
                id={record.id}
                value={record.id}
                onChange={(e) => handleCheckboxChange(e.target.value)}
              />
              <label htmlFor={record.id}>{record.name}</label>
            </div>
          ))}
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      );
    } else {
      alert("Success");
    }
  };

  return (
    <div>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        style={{
          margin: "1rem"
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form>{renderForm()}</form>
    </div>
  );
};

export default AddManagers;
