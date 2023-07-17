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

const TableRelations = ({ list }) => {
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
                <Button>DELETE</Button>
              </TableCell>
              <TableCell>
                <Button>EDIT</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRelations;
