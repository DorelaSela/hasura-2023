import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper,
  Tooltip
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditStep1 = ({ setCurrentStep, badges }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const [title, setTitle] = useState(badges.title);
  const [description, setDescription] = useState(badges.description);

  const firstStepSubmit = (data) => {
    setCurrentStep(2);
    // submitData(data, currentStep);
  };

  return (
    <>
      <form onSubmit={handleSubmit(firstStepSubmit)}>
        <TextField />
        <TextField />
        <Tooltip title="Next">
          <Button
            className="button"
            type="submit"
            variant="outlined"
            color="primary"
          >
            Next
          </Button>
        </Tooltip>
      </form>
    </>
  );
};
export default EditStep1;
