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

const TableRelations = ({ list, relationId, deleteRelations, dataType }) => {
  const navigate = useNavigate();

  const handleAddRelation = () => {
    navigate(`/managers/${relationId}/addRelation`);
  };

  const addRelations = () => {
    navigate(`/engineers/addRelations/${relationId}`);
  };

  if (list.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No relations found.
      </Typography>
    );
  }

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
                {dataType === "engineer" ? (
                  <Button
                    onClick={() => deleteRelations({ relationId, id: item.id })}
                  >
                    DELETE
                  </Button>
                ) : (
                  <Button
                    onClick={() => deleteRelations({ relationId, id: item.id })}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addRelations}>Add Relation</Button>
      <br />
      <Button onClick={handleAddRelation}>Add new relation</Button>
    </TableContainer>
  );
};

export default TableRelations;
