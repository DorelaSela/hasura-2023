import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TableRelations = ({ list, deleteRelations, engineerId }) => {
  const navigate = useNavigate();
  if (list.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No relations found.
      </Typography>
    );
  }

  const addRelations = () => {
    navigate(`/engineers/addRelations/${engineerId}`);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Button onClick={() => deleteRelations(engineerId, item.id)}>
                  DELETE
                </Button>
              </TableCell>
              <TableCell>
                <Button>EDIT</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addRelations}>Add Relation</Button>
    </TableContainer>
  );
};

export default TableRelations;
