import React, { useState } from "react";
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
  IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GET_ENGINEERS_BY_MANAGER } from "../../containers/state/ManagersQueries";
import { GET_MANAGERS_BY_ENGINEER } from "../../containers/state/EngineersQueries";
import { useMutation } from "@apollo/client";
import TableRelations from "./TableRelations";

const TableForm = ({ data, onDelete, dataType, onEdit, onDeleteRelations }) => {
  const [openRows, setOpenRows] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [getEngineersByManager] = useMutation(GET_ENGINEERS_BY_MANAGER);
  const [getManagersByEngineer] = useMutation(GET_MANAGERS_BY_ENGINEER);

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

  const deleteRelation = ({ relationId, id }) => {
    onDeleteRelations(relationId, id);
    if (dataType === "manager") {
      setEngineers((oldEng) => oldEng.filter((eng) => eng.id != id));
    } else {
      setManagers((oldMng) => oldMng.filter((mng) => mng.id != id));
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
                  <IconButton
                    color="error"
                    onClick={() => onDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
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
                                  relationId={item.id}
                                  deleteRelations={deleteRelation}
                                  dataType={dataType}
                                />
                              ) : (
                                <TableRelations
                                  list={managers}
                                  relationId={item.id}
                                  deleteRelations={deleteRelation}
                                  dataType={dataType}
                                />
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

export default TableForm;
