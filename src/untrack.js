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

        url = this._removeUtmParams(url)

        let href = url.toString().replace(/(.*?)\/$/m, '$1')
        href = this._applyAmazonFilter(url, href)

        // Fix double slashes
        href = href.replace(/.*?:\/{2}/, '')
        if (href.match(/\/+/g)) {
            href = href.replace(/\/+/g, '/')
        }
        href = `${url.protocol}//${href}`

        return href
    }

    /**
     * @param {URL} url
     * @returns {URL}
     */
    _removeUtmParams(url) {
        let keysToBeRemoved = []

        url.searchParams.forEach((_, key) => {
            let k = key.toLowerCase()
            let remove = false
            remove |= k.startsWith("utm")
            remove |= k === "gclid"
            if (remove) {
                keysToBeRemoved.push(key)
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
     * @param {URL} url
     * @param {string} href
     */
    _applyAmazonFilter(url, href) {
        // https://www.amazon.de/-/en/foo/dp/B07PHPXHQS?smid=A3JWKAKR8XB7XF&pf_rd_r=R80RVRWZRFGYYKQNGBBE&pf_rd_p=3c78f42a-d704-4818-8bfc-c9e46b44ef25
        // https://www.amazon.com/foo/dp/B082T62BCF/ref=sr_1_3?dchild=1&keywords=amazonbasics&pf_rd_p=fef24073-2963-4c6b-91ab-bf7eab1c4cac&pf_rd_r=4FPCYYPMP15VS755ER5C&qid=1602711396&sr=8-3
        // https://www.amazon.com/gp/product/1932700005?pf_rd_r=4FPCYYPMP15VS755ER5C&pf_rd_p=6fc81c8c-2a38-41c6-a68a-f78c79e7253f

        // Fix DP
        if (href.match(/.*?amazon\..*?\/.*?\/dp\//i)) {
            href = href.replace(/(.*?amazon\..*?\/)(.*?)(\/dp\/[a-z0-9]+).*/i, '$1$3')
        }

        // Fix GP
        if (href.match(/.*?amazon\..*?\/gp\/.*?\//i)) {
            href = href.replace(/(.*?amazon\..*?\/gp\/.*?\/)([a-z0-9]+)(.*)/i, '$1$2')
        }

        return href
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