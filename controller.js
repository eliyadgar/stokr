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
    const length = Object.keys(model.ui.stockModes).length;
    if (i === length - 1) {
      model.state.ui.stockMode = 0;
    } else {
      model.state.ui.stockMode = ++i;

    }

    view.render(model.state);
  }

  function reorderHandler(i, j) {
    swap(i, j);
    changeStocksOrder();
    view.render(model.state);
  }

  function swap(i, j) {
    if (j < 0 || j >= model.state.ui.order.length) {
      return;
    }
    let temp = model.state.ui.order[i];
    model.state.ui.order[i] = model.state.ui.order[j];
    model.state.ui.order[j] = temp;
  }

  function changeStocksOrder() {
    let sortedArr = [];
    model.state.ui.order.forEach(s => {
      sortedArr.push(model.state.stocks.find(stock => stock.Symbol === s));
    });
    model.state.stocks = sortedArr;
  }

  function init() {
    view.render(model.state); //TODO: add getter
    view.attachEventListeners(model.state);
  }

  init();

  window.stokr.controller = {
    toggleBtnHandler,
    reorderHandler
  }
}());
