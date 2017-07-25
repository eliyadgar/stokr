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
      <li class="stock-item" data-symbol="${ stock.Symbol}" ">
            <div class="stock-name"><span>${ stock.Symbol } \(${ stock.Name }\)</span></div>
            <div class="stock-details">
              <span>${ fixDisplayValue(stock.LastTradePriceOnly) }</span>
              <button class="toggle-btn PercentChange ${ btnDisplayClass }" data-id="toggle" data-val="${ stock.Change }">${ toggleBtnValue }</button>
              <div class="order-buttons">
                <button class="move-up icon-arrow" data-id="reorder" data-direction="up"></button>
                <button class="move-down icon-arrow" data-id="reorder" data-direction="down"></button>
              </div>
            </div>
          </li>
    `;
  }

  function render(state) {
    const main = document.querySelector('main');
    main.innerHTML = renderStocksList(state.stocks, state.ui);
  }

  function attachEventListeners(state) {
    const controller = window.stokr.controller;
    document.querySelector('main').addEventListener('click', (event) => {
      if (event.target.dataset.id === 'toggle') {
        controller.toggleBtnHandler(state.ui);
      } else if (event.target.dataset.id === 'reorder') {
        changeListOrder(event, state);
      }
      event.stopPropagation();
    });
  }

  function changeListOrder(event, state) {
    const controller = window.stokr.controller;
    let symbol = getStockSymbol(event.target);
    let i = getStockIndex(symbol, state.ui.order);
    if (event.target.dataset.direction === 'up') {
      controller.reorderHandler(i, i - 1);
    } else if (event.target.dataset.direction === 'down') {
      controller.reorderHandler(i, i + 1);
    }
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
      0: stock.Change,
      1: stock.PercentChange
    }
    return fixDisplayValue(modes[uiState.stockMode]);
  }

  function renderStocksList(stocks, uiState) {
    return `<ul class="stocks-list">${ stocks.map(stock => renderStock(stock, uiState)).join('') }</ul>`;
  }

  function getStockIndex(symbol, order) {
    return order.indexOf(symbol)
  }

  window.stokr.view = {
    render,
    attachEventListeners
  }

}());
