/**
 * Created by eliy on 18/07/2017.
 */


let data = [
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

function  renderStocksList(stocks) {
  return `<ul>${ stocks.map(renderStock).join() }</ul>`;
}

function renderStock(stock) {
  return `
    <li>
          <span>${ stock.Symbol } ${ stock.Name }</span>
          <div>
            <span>${ stock.LastTradePriceOnly }</span>
            <button>${ stock.PercentChange }</button>
            <div class="order-buttons">
              <button class="move-up">^</button>
              <button class="move-down">v</button>
            </div>
          </div>
        </li>
  `;

}





function render() {
  let main = document.getElementById('main');
  main.innerHTML = renderStocksList(data);
}

render();
