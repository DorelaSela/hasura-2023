import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { StepLabel, Step, Stepper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MANAGERS,
  LOAD_ENGINEERS,
  CREATE_ENGINEERS_MUTATION,
  ADD_RELATIONS
} from "../../../../containers/state/EngineersQueries";

const CreateEngineers = () => {
  const [name, setName] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [managers, setManagers] = useState(null);
  const [id, setId] = useState(null);
  const getManagers = useQuery(GET_MANAGERS);
  const navigate = useNavigate();
  const [insertEngineers, { error, data }] = useMutation(
    CREATE_ENGINEERS_MUTATION,
    {
      refetchQueries: [{ query: LOAD_ENGINEERS }]
    }
  );
  const [addRelation] = useMutation(ADD_RELATIONS);

  const steps = ["Create name", "Choose relation"];

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data && data.insert_users_one) {
      const engineerId = data.insert_users_one.id;
      setId(engineerId);
      console.log(engineerId);
    }
  }, [data]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = () => {
    addRelation({
      variables: {
        engineer: id,
        manager: managers
      }
    });
    navigate("/engineers");
  };

  const addEngineer = () => {
    insertEngineers({
      variables: {
        name: name
      }
    });
    handleNext();
  };

  const renderForm = () => {
    if (activeStep === 0) {
      return (
        <div>
          <TextField
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={addEngineer}>Next</Button>
        </div>
      );
    } else if (activeStep === 1) {
      return (
        <div>
          <h4>Managers</h4>
          <select onChange={(e) => setManagers(e.target.value)}>
            <option value="">Select a Manager</option>
            {getManagers.data.managers.map((record) => (
              <option key={record.id} value={record.id}>
                {record.name}
              </option>
            ))}
          </select>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      );
    } else {
      alert("You should create a engineer");
    }
  };

  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep}>
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

export default CreateEngineers;
