import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources } from 'actions/searchActions';
import { fetchUnits } from 'actions/unitActions';
import DateHeader from 'screens/shared/date-header';
import { scrollTo } from 'utils/DOMUtils';
import SearchControls from './controls/SearchControls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results';

export class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
  }

  componentDidMount() {
    const { actions, filters, searchDone } = this.props;
    if (searchDone || filters.purpose || filters.people || filters.search) {
      actions.searchResources(filters);
    }
    actions.fetchUnits();
  }

  componentWillUpdate(nextProps) {
    const { filters, searchDone } = nextProps;
    if (isEqual(nextProps.filters, this.props.filters)) {
      return;
    }
    if (searchDone || filters.purpose || filters.people || filters.search) {
      this.props.actions.searchResources(filters);
    }
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  render() {
    const {
      filters,
      isFetchingSearchResults,
      location,
      params,
      results,
      searchDone,
      units,
    } = this.props;

    return (
      <DocumentTitle title="Haku - Varaamo">
        <div className="search-page">
          <h1>Haku</h1>
          <SearchControls
            location={location}
            params={params}
            scrollToSearchResults={this.scrollToSearchResults}
          />
          {searchDone && <DateHeader date={filters.date} />}
          {searchDone || isFetchingSearchResults ? (
            <SearchResults
              date={filters.date}
              isFetching={isFetchingSearchResults}
              ref="searchResults"
              results={results}
              units={units}
            />
          ) : (
            <p className="help-text">
              Etsi tilaa syöttämällä hakukenttään tilan nimi tai tilaan liittyvää tietoa.
            </p>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  searchDone: PropTypes.bool.isRequired,
  units: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    searchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(searchPageSelector, mapDispatchToProps)(UnconnectedSearchPage);
