/**
 * Created by eliy on 18/07/2017.
 */
(function () {
  "use strict";

  let state = [
    {
      "Symbol": "WIX",
      "Name": "Wix.com Ltd.",
      "Change": "0.750000",
      "PercentChange": "+1.51%",
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "YHOO",
      "Name": "Yahoo! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "LastTradePriceOnly": "50.599998"
    }
  ];

  let stocksList = ['WIX', 'MSFT', 'YHOO'];

  let STOCKS_MODE = {
    dailyChange: 'dailyChange',
    marketCapital: 'marketCapital'
  }

  let stockViewState;


  function renderStock(stock) {
    let btnDisplayClass = setBtnValueStyle(stock);
    return `
      <li class="stock-item" data-symbol="${ stock.Symbol}" ">
            <div class="stock-name"><span>${ stock.Symbol } \(${ stock.Name }\)</span></div>
            <div class="stock-details">
              <span>${ fixDisplayValue(stock.LastTradePriceOnly) }</span>
              <button class="toggle-btn PercentChange ${ btnDisplayClass }" data-id="toggle" data-val="${ stock.Change }">${ getToggleBtnValue(stock) }</button>
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
    main.innerHTML = renderStocksList(state);
  }

  function renderStocksList(stocks) {
    return `<ul class="stocks-list">${ stocks.map(renderStock).join('') }</ul>`;
  }

  function attachEventListeners() {
    document.querySelector('main').addEventListener('click', (event) => {
      if (event.target.dataset.id === 'toggle') {
        toggleButtonEventHandler();
      } else if (event.target.dataset.id === 'reorder') {
        state = reorderHandler(event);
      }
      render(state);
      event.stopPropagation();
    });
  }

  function toggleButtonEventHandler() {
    stockViewState = stockViewState === STOCKS_MODE.dailyChange ? STOCKS_MODE.marketCapital : STOCKS_MODE.dailyChange;
  }

  function setBtnValueStyle(stock) {
    let btnVal = getToggleBtnValue(stock);
    return (btnVal.toString().includes('-')) ? 'value-down' : 'value-up';
  }

  function reorderHandler(event) {
    let i = stocksList.indexOf(getStockSymbol(event.target));
    if (event.target.dataset.direction === 'up') {
      swap(stocksList, i, i - 1);
    } else if (event.target.dataset.direction === 'down') {
      swap(stocksList, i, i + 1);
    }
    return changeStocksOrder(stocksList);
  }

  function changeStocksOrder(stocksList) {
    let sortedArr = [];
    stocksList.forEach(s => {
      sortedArr.push(state.find(stock => stock.Symbol === s));
    });
    return sortedArr;
  }

  function getStockSymbol(elm) {
    // return elm.closest("li");
    while (!elm.dataset.symbol) {
      elm = elm.parentNode;
    }
    return elm.dataset.symbol;
  }

  function getToggleBtnValue(stock) {
    debugger;
    return stockViewState === STOCKS_MODE.dailyChange ? stock.PercentChange : fixDisplayValue(stock.Change);
  }

  function init(state) {
    stockViewState = STOCKS_MODE.dailyChange;
    attachEventListeners();

    render(state);
  }

  init(state);

  /**********************************************************************************************/

  function fixDisplayValue(value) {
    return Math.trunc(parseFloat(value) * 100) / 100

  }

  function swap(arr, i, j) {
    if (j < 0 || j >= arr.length) {
      return;
    }
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}());
