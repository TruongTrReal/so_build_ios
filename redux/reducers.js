// reducers.js
const initialState = {
    activeTab: '1',
    accountNumber: '123456', 
    accountSummary: {
        account_type: 3,
        account_number: "123456",
        total_asset: 0,
        total_cash: 0,
        margin_ratio: 55.55,
    },
    accountPortfolio: {
        stocks: [
            {
                stock_symbol: "DIG",
                owning_price: 15123,
                t0_volume: 500,
                t1_volume: 300,
                t2_volume: 200,
                other_volume: 700,
                having_volume: 8000,
                reward_volume: 0,
                FS_volume: 0,
                Outroom_volume: 0,
                total_volume: 9700,
                can_sell_volume: 1700,
                market_price: 25800,
                change: 500,
            }
        ]
    },
    accountPortfolioSummary: {
        totalGain: '+123',
        totalGainPercentage: '+12.21 %',
        totalAsset: '100',
        totalMarketValue: '100',
        todayChange: '+100',
    },
    gain_hidden: false,
    volume_hidden: false,

  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };

        case 'SET_ACCOUNT_NUMBER':
            return { ...state, accountNumber: action.payload };

        case 'SET_ACCOUNT_SUMMARY':
            return { ...state, accountSummary: action.payload };

        case 'SET_ACCOUNT_PORTFOLIO':
            return { ...state, accountPortfolio: action.payload };

        case 'SET_ACCOUNT_PORTFOLIO_SUMMARY':
            return { ...state, accountPortfolioSummary: action.payload };

        case 'SET_GAIN_HIDDEN':
            return { ...state, gain_hidden: action.payload };
            
        case 'SET_VOLUME_HIDDEN':
            return { ...state, volume_hidden: action.payload };
    
        default:
            return state;
    }
  };
  
  export default rootReducer;