export const Matchers = {
  google: {
    match: '*',
    params: ['utm*', 'gclid']
  },
  matomo: {
    // formerly piwik
    match: '*',
    params: ['pk_campaign']
  },
  amazon: [
    {
      match: 'amazon?',
      params: ['m', 's', 'th', 'psc', 'dchild', 'tag', 'ascsubtag', 'pf*', 'ref', 'keywords', 'qid', 'sr']
    },
    {
      match: /.*?amazon\..*?\/.*?\/dp\//i,
      replace: [/(.*?amazon\..*?\/)(.*?)(\/dp\/[a-z0-9\\-]+).*/i, '$1$3']
    },
    {
      match: /.*?amazon\..*?\/gp\/.*?\//i,
      replace: [/(.*?amazon\..*?\/gp\/.*?\/)([a-z0-9]+)(.*)/i, '$1$2']
    }
  ],
  ebay: {
    match: 'ebay?',
    params: ['_trkparms', '_trksid'],
    replace: [/(.*?ebay\..*?\/itm\/)(.*?\/)(.*$)/i, '$1$3']
  }
}
