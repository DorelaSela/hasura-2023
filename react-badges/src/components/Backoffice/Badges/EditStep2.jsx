import { Button, TextField, Tooltip } from "@mui/material";
import { useForm } from "react-hook-form";

const EditStep2 = ({ setCurrentStep, badgesData }) => {
  const {
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const currentStep = 2;
  const secondStepSubmit = (data) => {
    alert("successfully submitted :D !");
    reset();
    setCurrentStep(1);
    // submitData(data, currentStep);
  };

  return (
    <>
      <form onSubmit={handleSubmit(secondStepSubmit)}>
        <TextField />
        <Tooltip title="Next">
          <Button
            className="button"
            type="submit"
            variant="outlined"
            color="primary"
          >
            Finish
          </Button>
        </Tooltip>
      </form>
    </>
  );
};
export default EditStep2;
