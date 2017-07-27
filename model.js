/**
 * Created by eliy on 23/07/2017.
 */

/**
 * MODEL
 */

(function () {
  "use strict";

  window.stokr = window.stokr || {};


  const state = {
    ui: {
      isFiltersShown: false,
      filters: {
        name: '',
        gain: 'All',
        rangeFrom: '',
        rangeTo: ''
      },
      stockModes: {
        0: 'change',
        1: 'percent'
      },
      stockMode: 0,
    },
    symbolList: [
      'WIX',
      'MSFT',
      'GOOG',
      'PERI',
      'FB',
      'BMW',
      'GPO'
    ],
    stocks: []
  };


  window.stokr.model = {
    state
  };


})();
