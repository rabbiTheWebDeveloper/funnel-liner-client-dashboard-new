import { Box, FormControl, Select, Stack, Pagination, MenuItem } from '@mui/material';

const CustomPagination = ({setPerPage ,perPage, setCurrentPage ,currentPage, totalPage}) => {

  
  const handlePerPageChange = event => {
    const perPageValue = parseInt(event.target.value);
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <Box
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
    }}
  >
    <div
      className="DropDown Download "
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: "14px" }}>Rows per page</span>
      <div id="per-page-select_order">
        <FormControl
          variant="outlined"
          style={{ width: "100px", marginLeft: "10px" }}
        >
          <Select
            id="per-page-select"
            value={perPage}
            onChange={handlePerPageChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>

    <Stack spacing={2}>
      <Pagination
        count={totalPage}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
      />
    </Stack>
    <div></div>
  </Box>
  );
};

export default CustomPagination;