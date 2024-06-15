export const gtmPageView = (rest: Object) => {
  window.dataLayer?.push({
    event: 'page_view',
    url: window.location.href,
    ...rest,
  });
};
