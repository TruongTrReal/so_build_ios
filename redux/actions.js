// actions.js
export const setActiveTab = (tab) => ({
    type: 'SET_ACTIVE_TAB',
    payload: tab,
  });
  
export const setAccountNumber = (accountNumber) => ({
  type: 'SET_ACCOUNT_NUMBER',
  payload: accountNumber,
});

export const setAccountSummary = (accountSummary) => ({
  type: 'SET_ACCOUNT_SUMMARY',
  payload: accountSummary,
});

export const setAccountPortfolio = (accountPortfolio) => ({
  type: 'SET_ACCOUNT_PORTFOLIO',
  payload: accountPortfolio,
});

export const setAccountPortfolioSummary = (accountPortfolioSummary) => ({
  type: 'SET_ACCOUNT_PORTFOLIO_SUMMARY',
  payload: accountPortfolioSummary,
});

export const setGainHidden = (gain_hidden) => ({
  type: 'SET_GAIN_HIDDEN',
  payload: gain_hidden,
});

export const setVolumeHidden = (volume_hidden) => ({
  type: 'SET_VOLUME_HIDDEN',
  payload: volume_hidden,
});