import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Autocomplete,
  Alert,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fundingSeriesOptions, locations, industries } from '../data/mockData';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 10,
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const LabeledInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: '#2E3B55',
  display: 'flex',
  alignItems: 'center',
}));

// Format date (MM/YYYY)
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

const Founders = () => {
  const { allUsers } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // Get only founders from all users (memoized)
  const founders = useMemo(() => allUsers.filter(user => user.isFounder), [allUsers]);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [fundingSeries, setFundingSeries] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [showFilters, setShowFilters] = useState(!isMobile);
  
  // State for founders
  const [filteredFounders, setFilteredFounders] = useState(founders);
  
  // Pagination
  const [page, setPage] = useState(1);
  const foundersPerPage = 6;
  
  // Effect to filter founders when filters change
  useEffect(() => {
    let mounted = true;
    
    const applyFilters = () => {
      let results = [...founders];
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(founder => 
          founder.name.toLowerCase().includes(query) ||
          founder.company.toLowerCase().includes(query) ||
          founder.bio.toLowerCase().includes(query)
        );
      }
      
      // Apply funding series filter
      if (fundingSeries) {
        results = results.filter(founder => founder.fundingSeries === fundingSeries);
      }
      
      // Apply industry filter
      if (industry) {
        results = results.filter(founder => founder.industry === industry);
      }
      
      // Apply location filter
      if (location) {
        results = results.filter(founder => founder.location.includes(location));
      }
      
      // Apply company size filter
      if (companySize) {
        results = results.filter(founder => founder.companySize === companySize);
      }
      
      // Apply looking for filter
      if (lookingFor) {
        results = results.filter(founder => 
          founder.lookingFor && founder.lookingFor.includes(lookingFor)
        );
      }
      
      if (mounted) {
        setFilteredFounders(results);
        setPage(1); // Reset to first page when filters change
      }
    };
    
    applyFilters();
    
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [founders, searchQuery, fundingSeries, industry, location, companySize, lookingFor]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredFounders.length / foundersPerPage);
  const currentFounders = filteredFounders.slice(
    (page - 1) * foundersPerPage,
    page * foundersPerPage
  );
  
  // Handler functions
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setFundingSeries('');
    setIndustry('');
    setLocation('');
    setCompanySize('');
    setLookingFor('');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleConnect = (founderId) => {
    console.log('Connecting with founder:', founderId);
    // Future implementation
  };
  
  const handleViewProfile = (founderId) => {
    navigate(`/profile/${founderId}`);
  };
  
  // Options
  const companySizeOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const lookingForOptions = ['Funding', 'Co-founder', 'Mentorship', 'Partnerships', 'Talent', 'Customers'];
  
  // Effect to remove any invisible overlays that might block navigation when component unmounts
  useEffect(() => {
    return () => {
      // Force cleanup of any potential blocking elements
      const overlays = document.querySelectorAll('.MuiBackdrop-root, .MuiPopover-root');
      overlays.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, []);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2E3B55' }}>
        Find Founders
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Connect with founders based on funding stage, industry, location, and more.
      </Typography>
      
      {/* Search and Filter Section */}
      <StyledPaper sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, company, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setSearchQuery('')} 
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ mb: { xs: 2, md: 0 }, mr: { md: 2 } }}
          />
          
          {isMobile && (
            <IconButton 
              onClick={toggleFilters} 
              sx={{ 
                ml: 1, 
                backgroundColor: '#2E3B55', 
                color: 'white',
                '&:hover': { backgroundColor: '#3a4b6d' } 
              }}
            >
              <FilterListIcon />
            </IconButton>
          )}
        </Box>
        
        {showFilters && (
          <Grid container spacing={2}>
            {/* Funding Series Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                <InputLabel
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  Funding Series
                </InputLabel>
                <Select
                  value={fundingSeries}
                  onChange={(e) => setFundingSeries(e.target.value)}
                  label="Funding Series"
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {fundingSeriesOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Industry Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                <InputLabel
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  Industry
                </InputLabel>
                <Select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  label="Industry"
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {industries.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Location Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                <InputLabel
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  Location
                </InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  label="Location"
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {locations.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Company Size Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                <InputLabel
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  Company Size
                </InputLabel>
                <Select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  label="Company Size"
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {companySizeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Looking For Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: '200px' }}>
                <InputLabel
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  Looking For
                </InputLabel>
                <Select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  label="Looking For"
                  sx={{
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    display: 'block'
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {lookingForOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Clear Filters Button */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ 
                  borderColor: '#2E3B55', 
                  color: '#2E3B55',
                  '&:hover': {
                    borderColor: '#2E3B55',
                    backgroundColor: 'rgba(46, 59, 85, 0.05)',
                  },
                  minWidth: '200px'
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        )}
      </StyledPaper>
      
      {/* Founders Grid */}
      {currentFounders.length > 0 ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {currentFounders.map((founder) => (
              <Grid item xs={12} sm={6} md={4} key={founder.id}>
                <StyledCard>
                  {/* Card Header with Avatar and Name */}
                  <Box sx={{ 
                    bgcolor: '#2E3B55', 
                    p: 2, 
                    color: 'white',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    position: 'relative'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                      <Avatar
                        src={founder.avatar}
                        alt={founder.name}
                        sx={{ width: 80, height: 80, border: '3px solid white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                      />
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ pt: 3, pb: 0, px: 3, flexGrow: 1 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                      {founder.name}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1" 
                      align="center" 
                      color="text.secondary"
                      gutterBottom
                    >
                      {founder.role} at {founder.company}
                    </Typography>
                    
                    {/* Company Details */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1.5,
                      justifyContent: 'center'
                    }}>
                      <Chip 
                        label={founder.fundingSeries || 'Not specified'} 
                        size="small"
                        sx={{ 
                          mr: 1, 
                          backgroundColor: '#2E3B55',
                          color: 'white'
                        }} 
                      />
                      <Chip 
                        label={founder.industry} 
                        size="small"
                        sx={{ backgroundColor: '#f0f0f0' }} 
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1.5
                    }}>
                      <BusinessIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">
                        {founder.companySize || 'Unknown'} employees
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1.5
                    }}>
                      <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">
                        {founder.location}
                      </Typography>
                    </Box>
                    
                    {founder.website && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <LinkIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography 
                          variant="body2" 
                          component="a" 
                          href={founder.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#2E3B55', textDecoration: 'none' }}
                        >
                          {founder.website.replace(/^https?:\/\//i, '')}
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Looking For Section */}
                    {founder.lookingFor && founder.lookingFor.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Looking for:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {founder.lookingFor.map((item, index) => (
                            <Chip 
                              key={index} 
                              label={item} 
                              size="small"
                              sx={{ backgroundColor: '#e8f4fd' }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Skills Section */}
                    <Typography variant="subtitle2" gutterBottom>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {founder.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small"
                          sx={{ backgroundColor: '#f0f0f0' }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button 
                      variant="contained"
                      onClick={() => handleConnect(founder.id)}
                      sx={{ 
                        backgroundColor: '#2E3B55',
                        '&:hover': {
                          backgroundColor: '#3a4b6d',
                        }
                      }}
                    >
                      Connect
                    </Button>
                    <Button 
                      variant="outlined"
                      onClick={() => handleViewProfile(founder.id)}
                      sx={{ 
                        borderColor: '#2E3B55', 
                        color: '#2E3B55',
                        '&:hover': {
                          borderColor: '#2E3B55',
                          backgroundColor: 'rgba(46, 59, 85, 0.05)',
                        }
                      }}
                    >
                      View Profile
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </>
      ) : (
        <StyledPaper>
          <Alert 
            severity="info"
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            }
          >
            No founders match your current filters. Try adjusting your search criteria.
          </Alert>
        </StyledPaper>
      )}
    </Container>
  );
};

export default Founders;
