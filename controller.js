/**
 * Created by eliy on 18/07/2017.
 */

/**
 * CONTROLLER
 */


(function () {
  "use strict";

  window.stokr = window.stokr || {};
  const view = window.stokr.view;
  const model = window.stokr.model;


  function toggleBtnHandler() {
    let i = model.state.ui.stockMode;
    const length = Object.keys(model.state.ui.stockModes).length;
    if (i === length - 1) {
      model.state.ui.stockMode = 0;
    } else {
      model.state.ui.stockMode = ++i;

    }
    addToLocalStorage(model.state.ui);

    view.renderMainView(model.state.stocks, model.state.ui);
  }

  function displayFilterBar() {
    model.state.ui.isFiltersShown = model.state.ui.isFiltersShown ? false : true;
    addToLocalStorage(model.state.ui);
    view.renderMainView(model.state.stocks, model.state.ui);
  }

  function reorderHandler(symbol, direction) {
    let i = getStockIndex(symbol, model.state.symbolList);
    if (direction === 'up') {
      changeListOrder(i, i - 1);
    } else if (direction === 'down') {
      changeListOrder(i, i + 1);
    }
  }

  function getStockIndex(symbol, symbolList) {
    return symbolList.indexOf(symbol)
  }

  function changeListOrder(i, j) {
    swap(i, j);
    changeStocksOrder();
    view.renderMainView(model.state.stocks, model.state.ui);
  }

  function swap(i, j) {
    if (j < 0 || j >= model.state.symbolList.length) {
      return;
    }
    let temp = model.state.symbolList[i];
    model.state.symbolList[i] = model.state.symbolList[j];
    model.state.symbolList[j] = temp;
  }

  function changeStocksOrder() {
    model.state.stocks = model.state.symbolList
      .map(s => model.state.stocks.find(stock => stock.Symbol === s))
      .filter(s => !!s);
  }

  function filterStocks(filterBy) {
    let stocksArr = model.state.stocks;
    if (model.state.ui.isFiltersShown) {
      if (filterBy) {
        model.state.ui.filters = filterBy;
      } else {
        filterBy = model.state.ui.filters;
      }
      addToLocalStorage(model.state.ui);
      stocksArr = model.state.stocks;
      if (filterBy.name || filterBy.gain!== 'All' || filterBy.rangeFrom || filterBy.rangeTo) {
        stocksArr = model.state.stocks.filter(stock =>
          filterByName(stock, filterBy.name)
          && filterByGain(stock, filterBy.gain)
          // && isInRange(stock, filterBy.rangeFrom, filterBy.rangeTo)
        );
      }
    }
    view.renderMainView(stocksArr, model.state.ui);
  }

  function searchStock(searchValue){
    let url = 'http://localhost:7000/search?q=' + searchValue;
    return fetch(url)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(result => {
        view.renderSearchView(result.Result);
      })
  }

  function filterByName(stock, name) {
    if (name.trim() === '') {
      return true
    }

    return stock.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  }


  function filterByGain(stock, gain) {
    let stockGain;
    if (gain.toLowerCase() === 'all') {
      return true;
    }
    if (parseFloat(stock.PercentChange) > 0) {
      stockGain = 'gaining';
    } else {
      stockGain = 'losing';
    }
    return stockGain === gain;
  }

  function isInRange(stock, from, to) {
    from = from.trim();
    to = to.trim();
    return (parseFloat(stock.PercentChange) >= from) && (parseFloat(stock.PercentChange) <= to);
  }

  function fetchStocks() {
    const symbolList = model.state.symbolList.toString();
    let url = 'http://localhost:7000/quotes?q=' + symbolList;
    return fetch(url)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(result => {
        let stocks = result.query.results.quote;
        console.log(stocks);
        model.state.stocks = stocks;
        return stocks;
      })
      .catch('couldn\'t get json from server');
  }

  function handleViewChanged(viewHash) {
    switch (viewHash.toLowerCase()) {
      case '#search': {
        view.renderSearchView([]);
        break;
      }
      default: {
        view.renderMainView(model.state.stocks, model.state.ui);
        break;
      }
    }
  }

  function init() {
    model.state.ui = !!localStorage.getItem('uiState') ? JSON.parse(localStorage.getItem('uiState')) : model.state.ui;
    fetchStocks()
      .then(() => filterStocks(model.state.ui.filters));
  }

  function addToLocalStorage(uiState) {
    localStorage.setItem('uiState', JSON.stringify(uiState));
  }

  init();

  window.stokr.controller = {
    handleViewChanged,
    toggleBtnHandler,
    reorderHandler,
    filterStocks,
    displayFilterBar,
    searchStock,
    init
  }

}());
