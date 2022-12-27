import axios from 'axios';
import { Box, Grid, IconButton, InputBase, Modal, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import CardContent from '@mui/material/CardContent';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { API_URL } from '../utils/axios.instance.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  outline: 'none',
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Home() {
  const [page, setPage] = useState(1);
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [modalData, setModalData] = useState();
  const [resDetails, setResDetails] = useState();
  const [searchValue, setSearchValue] = useState('');
  const matches = useMediaQuery('(max-width:600px)');

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setItem('');
    setOpen(false);
  };

  const fetchPoke = async () => {
    const dataValue = await axios.get(`${API_URL}?limit=10000&offset=0`);
    const {
      data: { results },
    } = dataValue;
    setResDetails(results);
  };

  useEffect(() => {
    if (!searchValue) {
      fetchPoke();
    }
  }, [searchValue]);

  useEffect(() => {
    if (search && searchValue) {
      const searchData = async () => {
        const searchDataResult = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${searchValue.toLowerCase()}`
        );
        const {
          data: { species },
        } = searchDataResult;
        setResDetails([species]);
      };
      searchData();
      return;
    }
    if (item) {
      const searchDataItem = async () => {
        const searchDataResult = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${item.toLowerCase()}`
        );
        const { data } = searchDataResult;
        setModalData(data);
      };
      searchDataItem();
      return;
    }
    setSearch(false);
  }, [search, item]);

  const handleClickSearch = (event) => {
    event.preventDefault();
    setSearch(true);
  };
  const handleSearchEmpty = () => {
    setSearchValue('');
    setSearch(false);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearch(true);
    }
  };
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= resDetails.length / 20 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  return (
    <>
      <Paper
        // component="form"
        sx={{
          m: 10,
          p: '6px 8px',
          display: 'flex',
          // alignItems: 'center',
          width: matches ? 300 : 500,
          boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.2)',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for Pokemon/ press enter/ click on search icon"
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          value={searchValue}
        />
        {searchValue.length > 0 && (
          <Button>
            <ClearIcon onClick={handleSearchEmpty} />
          </Button>
        )}
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon onClick={handleClickSearch} />
        </IconButton>
      </Paper>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 3, sm: 2, md: 4 }}>
        {resDetails &&
          resDetails.length > 0 &&
          resDetails.slice(page * 20 - 20, page * 20).map((item) => {
            let itemNumber = item.url.split('/').reverse()[1];
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={itemNumber}>
                <Card
                  sx={{ maxWidth: 345, widht: 100 }}
                  onClick={() => {
                    handleOpen();
                    setItem(itemNumber);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    sx={{ objectFit: 'contain' }}
                    src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${itemNumber}.svg`}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Id: {itemNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '10vh',
          alignItems: 'center',
          m: 3,
        }}
      >
        <Box>
          <Button
            variant="contained"
            onClick={() => selectPageHandler(page - 1)}
          >
            Previous
          </Button>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => selectPageHandler(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
      {modalData && Object.keys(modalData).length > 0 && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                id="modal-modal-description"
                sx={{ mt: 2 }}
              >
                {modalData.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box>
                {console.log('modalData', modalData)}
                <CardMedia
                  component="img"
                  height="240"
                  sx={{ objectFit: 'contain' }}
                  src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${modalData.id}.svg`}
                  alt="green iguana"
                />
              </Box>
              <Box>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="right">
                          Base Stat
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Effort&nbsp;
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          name&nbsp;
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          url&nbsp;
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modalData &&
                        Object.keys(modalData).length > 0 &&
                        modalData.stats &&
                        modalData.stats.length > 0 &&
                        modalData.stats.map((item) => {
                          return (
                            <StyledTableRow key={item.id}>
                              <StyledTableCell align="right">
                                {item.base_stat}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {item.effort}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {item.stat.name}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {item.stat.url}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
