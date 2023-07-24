import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const TableRelations = ({ list, relationId, deleteRelations, dataType }) => {
  const navigate = useNavigate();

  const handleAddRelation = () => {
    navigate(`/managers/${relationId}/addRelation`);
  };

  const addRelations = () => {
    navigate(`/engineers/addRelations/${relationId}`);
  };

  const editRelations = (id) => {
    navigate(`/engineers/editRelations/${relationId}/${id}`);
  };

  if (list.length === 0) {
    return (
      <div>
        <Typography variant="body2" color="textSecondary">
          No Relation Found
        </Typography>
        <br></br>
        {dataType === "manager" ? (
          <Button onClick={handleAddRelation}>Add new relation</Button>
        ) : (
          <Button onClick={addRelations}>Add new relation</Button>
        )}
      </div>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Delete</TableCell>
            {dataType === "engineer" && <TableCell>Edit</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {dataType === "engineer" ? (
                  <IconButton
                    color="error"
                    onClick={() => deleteRelations({ relationId, id: item.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="error"
                    onClick={() => deleteRelations({ relationId, id: item.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
              <TableCell>
                {dataType === "engineer" && (
                  <IconButton
                    color="primary"
                    onClick={() => editRelations(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {dataType === "manager" ? (
        <Button onClick={handleAddRelation} variant="contained"  className="button-table" >
          Add new relation
        </Button>
      ) : (
        <Button
          onClick={addRelations}
          variant="contained"
          className="button-table"
        >
          Add new relation
        </Button>
      )}
    </TableContainer>
  );
};

export default TableRelations;
