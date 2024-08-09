import React from 'react';
import { InputAdornment, FormControl, FormLabel, Input} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
      <FormControl
        width={100}
        align="right"
        position="fixed"
        size="small">
        <Input
          placeholder="Search Items Here"
          variant="soft"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
  );
};

export default SearchBar;
