import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  EDIT_BADGE,
  LOAD_BADGES
} from "../../../containers/state/BadgesQueries";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import EditStep1 from "./EditStep1";
import EditStep2 from "./EditStep2";

const EditBadge = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const { badgeId } = useParams;
  const [currentStep, setCurrentStep] = useState(1);
  const [insert_badges_definitions, { loading, error, data }] = useMutation(
    EDIT_BADGE,
    { refetchQueries: [{ query: LOAD_BADGES }] }
  );

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <EditStep1 setCurrentStep={setCurrentStep}  />;
      case 2:
        return <EditStep2 setCurrentStep={setCurrentStep}  />;
      default:
        return null;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Card sx={{ padding: "16px", marginBottom: "16px", margin: "16px" }}>
      <CardContent>
        <Typography sx={{ marginBottom: "8px" }} variant="h1">
          Edit Badge - Requirements
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "space-evenly"
          }}
        >
          <Stepper activeStep={currentStep - 1}>
            <Step>
              <StepLabel>Edit Badge </StepLabel>
            </Step>
            <Step>
              <StepLabel>Edit Requirements</StepLabel>
            </Step>
          </Stepper>
          {showStep(currentStep)}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditBadge;
