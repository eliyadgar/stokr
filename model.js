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
      isFiltersShown: true,
      stockModes: {
        0: 'change',
        1: 'percent'
      },
      stockMode: 0,
      order: [
        'WIX',
        'MSFT',
        'YHOO'
      ]
    },

    stocks: [
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
    ]
  };


  window.stokr.model = {
    state
  };


})();
