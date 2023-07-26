import {
  Card,
  CardContent,
  Typography,
  Box,
  Step,
  StepLabel,
  Stepper
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  EDIT_BADGE,
  LOAD_BADGES
} from "../../../containers/state/BadgesQueries";
import { useParams } from "react-router-dom";
import EditStep1 from "./EditStep1";
import EditStep2 from "./EditStep2";

const EditBadge = () => {
  const { data: badgesData, loading, error } = useQuery(LOAD_BADGES);
  const { id: badgeId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  const showStep = (step) => {
    switch (step) {
      case 1:
        return (
          <EditStep1
            setCurrentStep={setCurrentStep}
            badgesData={badgesData}
            badgeId={badgeId}
          />
        );
      case 2:
        return (
          <EditStep2
            setCurrentStep={setCurrentStep}
            badgesData={badgesData}
            badgeId={badgeId}
          />
        );
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
    <CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >
        <Typography
          sx={{ marginBottom: "16px", marginTop: "20px" }}
          variant="h1"
        >
          Edit Badge - Requirements
        </Typography>
        <Stepper
          activeStep={currentStep - 1}
          sx={{ marginBottom: "16px", width: "80%" }}
        >
          <Step sx={{ "& .MuiStepLabel-label": { fontSize: "14px" } }}>
            <StepLabel>Edit Badge </StepLabel>
          </Step>
          <Step sx={{ "& .MuiStepLabel-label": { fontSize: "14px" } }}>
            <StepLabel>Edit Requirements</StepLabel>
          </Step>
        </Stepper>
      </Box>
      {showStep(currentStep)}
    </CardContent>
  );
};

export default EditBadge;
