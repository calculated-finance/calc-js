export const openIndexShareModal = (symbol: string) => {
  const selector = `[data-share-button="${symbol.toLowerCase()}"]`;
  const button = document.querySelector(selector) as HTMLButtonElement;
  if (button) {
    button.click();
  }
};
