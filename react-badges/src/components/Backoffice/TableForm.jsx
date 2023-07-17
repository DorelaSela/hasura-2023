import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Collapse,
  IconButton,
  Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { GET_ENGINEERS_BY_MANAGER } from "../../containers/state/ManagersQueries";
import { useMutation } from "@apollo/client";
import TableRelations from "./TableRelations";

const TableForm = ({ data, onDelete, dataType, onEdit, onDeleteRelation }) => {
  const [openRows, setOpenRows] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [getEngineersByManager] = useMutation(GET_ENGINEERS_BY_MANAGER);

  const handleRowClick = async (index, id) => {
    if (openRows.includes(index)) {
      setOpenRows(openRows.filter((rowIndex) => rowIndex !== index));
    } else {
      try {
        if (dataType === "manager") {
          const { data } = await getEngineersByManager({
            variables: { id }
          });
          setEngineers(data.get_engineers_by_manager);
        } else if (dataType === "engineer") {
          const { data } = await getManagersByEngineer({
            variables: { id }
          });
          setManagers(data.get_managers_by_engineer);
        }

        setOpenRows([...openRows, index]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <TableContainer>
      <Table aria-label="custom table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleRowClick(index, item.id)}
                  >
                    {openRows.includes(index) ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Button onClick={() => onDelete(item.id)}>Delete</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onEdit(item.id)}>Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={4}
                >
                  <Collapse
                    in={openRows.includes(index)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ margin: 1 }}>
                      <Typography variant="h6" gutterBottom component={"span"}>
                        {dataType === "engineer"
                          ? "Engineer relations with managers"
                          : "Manager relations with engineers"}
                      </Typography>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={4}>
                              {dataType === "manager" ? (
                                <TableRelations
                                  list={engineers}
                                  managerId={item.id}
                                  deleteRelation={onDeleteRelation}
                                />
                              ) : (
                                <TableRelations list={managers} />
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TableForm.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TableForm;
