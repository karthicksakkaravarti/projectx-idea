/**
 * Unit Tests: Chat Utils
 */

import { addUTM, getFavicon, formatUrl, getSiteName } from '@/app/components/chat/utils'

describe('Chat Utils', () => {
    describe('addUTM', () => {
        it('should add UTM parameters to a valid URL', () => {
            const url = 'https://example.com/page'
            const result = addUTM(url)

            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('utm_medium=research')
        })

        it('should preserve existing query parameters', () => {
            const url = 'https://example.com/page?foo=bar'
            const result = addUTM(url)

            expect(result).toContain('foo=bar')
            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('utm_medium=research')
        })

        it('should handle URLs with existing UTM parameters', () => {
            const url = 'https://example.com/page?utm_source=other'
            const result = addUTM(url)

            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('utm_medium=research')
        })

        it('should return original URL for invalid URLs', () => {
            const invalidUrl = 'not-a-valid-url'
            const result = addUTM(invalidUrl)

            expect(result).toBe(invalidUrl)
        })

        it('should return original URL for non-http(s) protocols', () => {
            const ftpUrl = 'ftp://example.com/file'
            const result = addUTM(ftpUrl)

            expect(result).toBe(ftpUrl)
        })

        it('should handle URLs with fragments', () => {
            const url = 'https://example.com/page#section'
            const result = addUTM(url)

            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('#section')
        })

        it('should handle URLs with ports', () => {
            const url = 'https://example.com:8080/page'
            const result = addUTM(url)

            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('8080')
        })

        it('should handle http URLs', () => {
            const url = 'http://example.com/page'
            const result = addUTM(url)

            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('utm_medium=research')
        })

        it('should handle mailto links by returning original', () => {
            const url = 'mailto:test@example.com'
            const result = addUTM(url)

            expect(result).toBe(url)
        })
    })

    describe('getFavicon', () => {
        it('should return favicon URL for valid https URL', () => {
            const url = 'https://example.com/page'
            const result = getFavicon(url)

            expect(result).toContain('google.com/s2/favicons')
            expect(result).toContain('domain=example.com')
            expect(result).toContain('sz=32')
        })

        it('should return favicon URL for valid http URL', () => {
            const url = 'http://example.com/page'
            const result = getFavicon(url)

            expect(result).toContain('google.com/s2/favicons')
            expect(result).toContain('domain=example.com')
        })

        it('should return null for null input', () => {
            const result = getFavicon(null)

            expect(result).toBeNull()
        })

        it('should return null for invalid URLs', () => {
            const result = getFavicon('not-a-valid-url')

            expect(result).toBeNull()
        })

        it('should return null for non-http(s) protocols', () => {
            const result = getFavicon('ftp://example.com')

            expect(result).toBeNull()
        })

        it('should handle URLs with www subdomain', () => {
            const url = 'https://www.example.com/page'
            const result = getFavicon(url)

            expect(result).toContain('domain=www.example.com')
        })

        it('should handle URLs with subdomains', () => {
            const url = 'https://blog.example.com/post'
            const result = getFavicon(url)

            expect(result).toContain('domain=blog.example.com')
        })

        it('should handle URLs with ports', () => {
            const url = 'https://example.com:3000/page'
            const result = getFavicon(url)

            expect(result).toContain('domain=example.com')
        })

        it('should handle URLs with paths', () => {
            const url = 'https://example.com/very/long/path/to/page'
            const result = getFavicon(url)

            expect(result).toContain('domain=example.com')
        })

        it('should handle URLs with query parameters', () => {
            const url = 'https://example.com/page?foo=bar&baz=qux'
            const result = getFavicon(url)

            expect(result).toContain('domain=example.com')
        })
    })

    describe('formatUrl', () => {
        it('should remove https:// prefix', () => {
            const url = 'https://example.com'
            const result = formatUrl(url)

            expect(result).toBe('example.com')
        })

        it('should remove http:// prefix', () => {
            const url = 'http://example.com'
            const result = formatUrl(url)

            expect(result).toBe('example.com')
        })

        it('should remove www. prefix', () => {
            const url = 'https://www.example.com'
            const result = formatUrl(url)

            expect(result).toBe('example.com')
        })

        it('should remove trailing slash', () => {
            const url = 'https://example.com/'
            const result = formatUrl(url)

            expect(result).toBe('example.com')
        })

        it('should handle URL with path', () => {
            const url = 'https://example.com/page'
            const result = formatUrl(url)

            expect(result).toBe('example.com/page')
        })

        it('should handle URL with path and trailing slash', () => {
            const url = 'https://example.com/page/'
            const result = formatUrl(url)

            expect(result).toBe('example.com/page')
        })

        it('should handle URL with query parameters', () => {
            const url = 'https://example.com/page?foo=bar'
            const result = formatUrl(url)

            expect(result).toBe('example.com/page?foo=bar')
        })

        it('should handle URL with fragment', () => {
            const url = 'https://example.com/page#section'
            const result = formatUrl(url)

            expect(result).toBe('example.com/page#section')
        })

        it('should return original for invalid URLs', () => {
            const url = 'not a url'
            const result = formatUrl(url)

            expect(result).toBe(url)
        })

        it('should handle URL without protocol', () => {
            const url = 'example.com'
            const result = formatUrl(url)

            expect(result).toBe('example.com')
        })
    })

    describe('getSiteName', () => {
        it('should extract hostname from https URL', () => {
            const url = 'https://example.com/page'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should extract hostname from http URL', () => {
            const url = 'http://example.com/page'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should remove www. prefix', () => {
            const url = 'https://www.example.com'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should preserve subdomains', () => {
            const url = 'https://blog.example.com'
            const result = getSiteName(url)

            expect(result).toBe('blog.example.com')
        })

        it('should handle URL with port', () => {
            const url = 'https://example.com:3000/page'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should handle URL with path', () => {
            const url = 'https://example.com/very/long/path'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should handle URL with query parameters', () => {
            const url = 'https://example.com/page?foo=bar'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should handle URL with fragment', () => {
            const url = 'https://example.com/page#section'
            const result = getSiteName(url)

            expect(result).toBe('example.com')
        })

        it('should return original string for invalid URLs', () => {
            const invalidUrl = 'not-a-valid-url'
            const result = getSiteName(invalidUrl)

            expect(result).toBe(invalidUrl)
        })

        it('should handle complex domains', () => {
            const url = 'https://docs.github.com/en/actions'
            const result = getSiteName(url)

            expect(result).toBe('docs.github.com')
        })
    })
})
