/**
 * Created by eliy on 23/07/2017.
 */

/**
 * VIEW
 */

(function () {
  "use strict";

  window.stokr = window.stokr || {};

  function renderStock(stock, uiState) {
    console.log(uiState);

    let btnDisplayClass = setBtnValueStyle(stock, uiState);
    let toggleBtnValue = getToggleBtnValue(stock, uiState);
    return `
      <li class="stock-item" data-symbol="${ stock.Symbol}">
            <div class="sign no-entry"></div>
            <div class="stock-name"><span>${ stock.Symbol } \(${ stock.Name }\)</span></div>
            <div class="stock-details">
              <span>${ fixDisplayValue(stock.LastTradePriceOnly) }</span>
              <button class="toggle-btn ${ btnDisplayClass }" data-id="toggle" data-val="${ stock.Change }">${ toggleBtnValue }</button>
              <div class="order-buttons">
                <button class="move-up icon-arrow" data-id="reorder" data-direction="up"></button>
                <button class="move-down icon-arrow" data-id="reorder" data-direction="down"></button>
              </div>
            </div>
          </li>
    `;
  }


  function renderMainView(stocks, uiState) {
    const main = document.querySelector('main');
    let viewContent = createMainViewHtml(stocks, uiState);
    main.innerHTML = viewContent;
    setupEventListeners();
  }

  function createMainViewHtml(stocks, uiState) {
    let viewContent = renderHeader();
    if (uiState.isFiltersShown) {
      viewContent += renderFilter();
    }
    viewContent += renderStocksList(stocks, uiState);
    return viewContent;
  }

  function renderSearchView(searchedStocks) {
    const searchViewMarkup = createSearchView(searchedStocks);
    const main = document.querySelector('main');
    main.innerHTML = searchViewMarkup;
    setupEventListenersOnSearch();
  }

  function setupEventListenersOnSearch() {
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener('submit', searchHandler);
  }


  function setupEventListeners() {
    const main = document.querySelector('main');
    const stockListElm = main.querySelector('.stocks-list');
    const filtersFormElm = document.querySelector('.filters-form');
    const headerElm = document.querySelector('header');

    headerElm ? headerElm.addEventListener('click', headerLinksHandler) : null;
    stockListElm ? stockListElm.addEventListener('click', stocksClickHandler) : null;
    filtersFormElm ? filtersFormElm.addEventListener('submit', filterSubmitHandler) : null;
  }


  function headerLinksHandler(event) {
    const controller = window.stokr.controller;
    if (event.target.dataset.id === 'filter-link') {
      event.target.classList.toggle('selected');
      // document.querySelector('.filters-form').classList.toggle('displayed');
      controller.displayFilterBar();
      // controller.init();
    }
   }

  function stocksClickHandler(event) {
    const controller = window.stokr.controller;
    if (event.target.dataset.id === 'toggle') {
      controller.toggleBtnHandler();
    } else if (event.target.dataset.id === 'reorder') {
      controller.reorderHandler(getStockSymbol(event.target), event.target.dataset.direction);
    } else if (event.target.dataset.id === 'filter') {
    }
    event.stopPropagation();

  }

  function filterSubmitHandler(event){
    const controller = window.stokr.controller;
    event.preventDefault();
    const filterBy = {
      name: document.getElementById('nameinput').value,
      gain: document.getElementById('gainselect').value,
      rangeFrom: document.getElementById('rangefrominput').value,
      rangeTo: document.getElementById('rangetoinput').value,
    }
    controller.filterStocks(filterBy);
    event.stopPropagation();
  }

  function hashchangeHandler(event) {
    // todo - fix hack
    const controller = window.stokr.controller;
    // controller.init();
    controller.handleViewChanged(window.location.hash);
  }

  function searchHandler(event) {
    const controller = window.stokr.controller;
    let searchValue = document.querySelector('#search-bar').value;
    controller.searchStock(searchValue);
  }


  function getStockSymbol(elm) {
    while (!elm.dataset.symbol) {
      elm = elm.parentNode;
    }
    return elm.dataset.symbol;
  }


  function fixDisplayValue(value) {
    return Math.trunc(parseFloat(value) * 100) / 100

  }
  function setBtnValueStyle(stock, uiState) {
    let btnVal = getToggleBtnValue(stock, uiState);
    return (btnVal.toString().includes('-')) ? 'value-down' : 'value-up';
  }

  function getToggleBtnValue(stock, uiState) {
    const modes = {
      0: fixDisplayValue(stock.Change),
      1: fixDisplayValue(stock.realtime_chg_percent) + '%'
    }
    return modes[uiState.stockMode];
  }

  function renderFilter() {
    return `<form class="filters-form">
        <div class="input-fields">
          <div>
            <label for="nameinput">
              By Name
            </label>
            <input id="nameinput" type="text" name="byname">
          </div>
          <div>
            <label for="gainselect">
              By Gain
            </label>
            <select id="gainselect">
              <option value="All">All</option>
              <option value="losing">Losing</option>
              <option value="gaining">Gaining</option>
            </select>
          </div>
          <div>
            <label for="rangefrominput">
              By Range: From
            </label>
            <input id="rangefrominput" type="number" step="0.01" name="byrangefrom">
          </div>
          <div>
            <label for="rangetoinput">
              By Range: To
            </label>
            <input id="rangetoinput" type="number" step="0.01" name="byrangeto">
          </div>
        </div>
        <div class="submit-wrapper">
          <input id="submit" type="submit" value="Submit" data-id="filter">
        </div>

      </form>`
  }

  function renderStocksList(stocks, uiState) {
    return `<ul class="stocks-list">${ stocks.map(stock => renderStock(stock, uiState)).join('') }</ul>`;
  }

  function renderHeader() {
    return `
     <header>
        <a class="logo" href="#">
          STOKR
        </a>
        <ul class="actions">
          <li><a href="#search" class="icon-search search"></a></li>
          <li><button class="icon-refresh refresh header-button"></button></li>
          <li><button class="icon-filter filter header-button" data-id="filter-link"></button></li>
          <li><button class="icon-settings settings header-button"></button></li>
        </ul>
      </header>
      `;
  }

  function createSearchView(stocks){
    return `
        <div class="search-header">
          <form id="search-form"><input id= "search-bar" type="text"></form>
          <a href="#">cancel</a>
        </div>
        <div class="search-results"></div>`;
  }

  window.addEventListener('hashchange', hashchangeHandler);

  window.stokr.view = {
    renderMainView, setupEventListeners, renderSearchView
  }

}());
