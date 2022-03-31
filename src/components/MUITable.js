import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles/';

const columns = [
    { id: 'submission_date', label: 'Submission Date', minWidth: 170 },
    { id: 'fName', label: 'First Name', minWidth: 170 },
    {
        id: 'lName',
        label: 'Last Name',
        minWidth: 170,
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 170,
    },
    {
        id: 'phone',
        label: 'Phone',
        minWidth: 170,
    },
    {
        id: 'zipcode',
        label: 'Zipcode',
        minWidth: 170,
    },
    {
        id: 'utm_source',
        label: 'UTM Source',
        minWidth: 170,
    },
    {
        id: 'utm_medium',
        label: 'UTM Medium',
        minWidth: 170,
    },
    {
        id: 'utm_campaign',
        label: 'UTM Campaign',
        minWidth: 170,
    },
    {
        id: 'utm_content',
        label: 'UTM Content',
        minWidth: 170,
    },
];

const useStyles = makeStyles({

    root: {
        "& .MuiTableCell-head": {
            backgroundColor: "#f0f0f0",
        },
    }
});


export default function StickyHeadTable({ submissions }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const classes = useStyles();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{
            width: '100%', overflow: 'hidden', backgroundColor: 'rgb(26, 32, 39)'
        }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead >
                        <TableRow className={classes.root}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, color: 'black' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submissions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((submission) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={submission.name}>
                                        {columns.map((column) => {
                                            const value = submission[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={{ color: 'white' }}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[100, 200, 300, 400, 500]}
                component="div"
                count={submissions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ color: 'white' }}
            />
        </Paper>
    );
}
