import React, { useEffect } from "react";
import styled from "styled-components";
import { DesignerSearch } from "../../thunks/DesignerSearch";
import { setSearchName } from "../../slice/DesignerSearch";
import { useDispatch, useSelector } from "react-redux";
import asset from "../../api/helper";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { searchResults, error, status, searchTerm } = useSelector(
    (state) => state.DesignerSearch
  );

  useEffect(() => {
    if (searchTerm) 
      dispatch(DesignerSearch(searchTerm));
  }, [searchTerm,dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleSearchChange = (e) => {
    dispatch(setSearchName(e.target.value));
  };

  const handleSearchbar = (e) => {
    e.preventDefault()
  }

  if (status === "failed") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <SearchPageContainer>
      <HeaderInfo>
        <h1 className="font40 extraBold">Search Our Designers</h1>
        <p className="font13">
          Enter the name or keyword to find the designer you're looking for.
        </p>
      </HeaderInfo>
      <SearchBar onSubmit={handleSearchbar}>
        <input
          type="text"
          placeholder="Search designers..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
      </SearchBar>
      <ResultsContainer className="row">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((results) => (
            <div className="col-xs-12 col-sm-6 col-md-4" key={results.id}>
              <ResultBox>
                <img src={asset(results.profileUrl)} alt={results.firstName} />
                <div className="info">
                  <h3>{results.firstName}</h3>
                  <p>Hello Im Cristiano Ronaldo</p>
                </div>
              </ResultBox>
            </div>
          ))
        ) : (
          <NoResults>No results found</NoResults>
        )}
      </ResultsContainer>
    </SearchPageContainer>
  );
};

export default SearchPage;

const SearchPageContainer = styled.div`
  padding: 40px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderInfo = styled.div`
  margin-bottom: 30px;

  h1 {
    margin-bottom: 10px;
    font-size: 2.5rem; /* Larger font size for headings */
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const SearchBar = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  input {
    width: 100%;
    max-width: 600px; /* Max width for larger screens */
    padding: 12px;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button {
    padding: 12px 20px;
    border: none;
    background-color: #007bff;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Space between cards */
`;

const ResultBox = styled.div`
  width: 100%;
  max-width: 300px;
  padding: 20px;
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .info {
    // margin-left: 0;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.5rem;
    text-align: center;
  }

  p {
    color: #666;
    font-size: 1rem;
    text-align: center;
  }

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    flex-direction: row;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 0;
      object-fit: cover;
    }

    .info {
      margin-left: 10px;
    }

    p {
      display: none;
    }

    h3 {
      margin-bottom: 0;
    }
  }
`;

const NoResults = styled.div`
  font-size: 1.5rem;
  color: #999;
  text-align: center;
  margin-top: 50px;
`;
