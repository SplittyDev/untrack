const Matchers = {
  google: {
    match: '*',
    params: ['utm*', 'gclid'],
  },
  matomo: { // formerly piwik
    match: '*',
    params: ['pk_campaign'],
  },
  amazon: [
    {
      match: 'amazon?',
      params: ['m', 'th', 'psc', 'tag', 'ascsubtag', 'pf*'],
    },
    {
      match: /.*?amazon\..*?\/.*?\/dp\//i,
      replace: [/(.*?amazon\..*?\/)(.*?)(\/dp\/[a-z0-9]+).*/i, '$1$3'],
    },
    {
      match: /.*?amazon\..*?\/gp\/.*?\//i,
      replace: [/(.*?amazon\..*?\/gp\/.*?\/)([a-z0-9]+)(.*)/i, '$1$2'],
    }
  ],
}

export default class Untrack {
  /**
   * @param {string} url
   */
  constructor(url) {
    this.url = url
  }

  /**
   * @returns {string}
   */
  process() {
    let url = this._getUrl()

    // On parsing failure, return plain URL
    if (url === null) {
      return this.url
    }

    let removeParams = []
    let replaceFuncs = []

    Object.values(Matchers)
      .map(matcher => (Array.isArray(matcher) ? matcher : [matcher]))
      .reduce((acc, val) => acc.concat(val), [])
      .filter(matcher => (
        matcher.match instanceof RegExp
        ? matcher.match.test(url.hostname)
        : this._matchesGlob(url.hostname, matcher.match)
      ))
      .forEach(matcher => {
        if ('params' in matcher) {
          for (const param of matcher.params) {
            removeParams.push(param)
          }
        }
        if ('replace' in matcher) {
          const [regex, replace] = matcher.replace
          replaceFuncs.push((href) => href.replace(regex, replace))
        }
      })

    // Remove parameters
    console.log(`Removing params: ${removeParams.join(', ')}`)
    url = this._removeParams(url, removeParams);

    // Apply replacement functions
    let href = url.toString().replace(/(.*?)\/$/m, "$1");
    href = replaceFuncs.reduce((acc, func) => func(acc), href)

    // Fix double slashes
    href = href.replace(/.*?:\/{2}/, "")
    if (href.match(/\/+/g)) href = href.replace(/\/+/g, "/")

    // Finalize result
    return `${url.protocol}//${href}`
  }

  /**
   * 
   * @param {string} subject
   * @param {string} glob
   * @returns {boolean}
   */
  _matchesGlob(subject, glob) {
    let isMatch = false
    let matchNoLastChar = glob.substring(0, glob.length - 1)
    // Match all: *
    isMatch |= glob == '*'
    // Match exact: host
    isMatch |= subject == glob
    // Match suffix: *host
    isMatch |= glob.startsWith('*') && subject.endsWith(glob.substring(1))
    // Match prefix: host*
    isMatch |= glob.endsWith('*') && subject.startsWith(matchNoLastChar)
    // Match like: host?
    isMatch |= glob.endsWith('?') && subject.includes(matchNoLastChar)
    return isMatch
  }

  /**
   * @param {URL} url
   * @param {string[]} keys
   * @returns {URL}
   */
  _removeParams(url, keys) {
    let keysToBeRemoved = []

    url.searchParams.forEach((_, key) => {
      let k = key.toLowerCase();
      for (let k2 of keys) {
        if (this._matchesGlob(k, k2)) {
          keysToBeRemoved.push(key)
          continue
        }
      }
    })

    for (const key of keysToBeRemoved) {
      console.log(`Removing ${key}`)
      url.searchParams.delete(key)
    }

    url.search = url.searchParams.toString()
    return url
  }

  /**
   * @returns {URL}
   */
  _getUrl() {
    try {
      return new URL(this.url)
    } catch {
      return null
    }
  }
}
