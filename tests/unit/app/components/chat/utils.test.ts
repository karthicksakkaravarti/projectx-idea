/**
 * Unit Tests: app/components/chat/utils.ts
 */

import { addUTM, getFavicon, formatUrl, getSiteName } from '@/app/components/chat/utils'

describe('app/components/chat/utils', () => {
    describe('addUTM', () => {
        it('should add UTM parameters to a valid URL', () => {
            const result = addUTM('https://example.com')
            expect(result).toContain('utm_source=projectx.app')
            expect(result).toContain('utm_medium=research')
        })

        it('should preserve existing URL path and query params', () => {
            const result = addUTM('https://example.com/path?existing=param')
            expect(result).toContain('/path')
            expect(result).toContain('existing=param')
            expect(result).toContain('utm_source=projectx.app')
        })

        it('should handle HTTP URLs', () => {
            const result = addUTM('http://example.com')
            expect(result).toContain('utm_source=projectx.app')
        })

        it('should return original URL for non-http(s) protocols', () => {
            const fileUrl = 'file:///path/to/file'
            expect(addUTM(fileUrl)).toBe(fileUrl)

            const ftpUrl = 'ftp://example.com'
            expect(addUTM(ftpUrl)).toBe(ftpUrl)

            const mailtoUrl = 'mailto:test@example.com'
            expect(addUTM(mailtoUrl)).toBe(mailtoUrl)
        })

        it('should return original URL for invalid URLs', () => {
            const invalidUrl = 'not-a-valid-url'
            expect(addUTM(invalidUrl)).toBe(invalidUrl)
        })

        it('should handle URLs with hash fragments', () => {
            const result = addUTM('https://example.com/page#section')
            expect(result).toContain('#section')
            expect(result).toContain('utm_source=projectx.app')
        })

        it('should handle URLs with ports', () => {
            const result = addUTM('https://example.com:8080/path')
            expect(result).toContain(':8080')
            expect(result).toContain('utm_source=projectx.app')
        })

        it('should override existing UTM parameters', () => {
            const result = addUTM('https://example.com?utm_source=other')
            expect(result).toContain('utm_source=projectx.app')
            expect(result).not.toContain('utm_source=other')
        })
    })

    describe('getFavicon', () => {
        it('should return Google favicon URL for valid URL', () => {
            const result = getFavicon('https://example.com')
            expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32')
        })

        it('should extract domain correctly from URL with path', () => {
            const result = getFavicon('https://example.com/some/path')
            expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32')
        })

        it('should handle subdomain URLs', () => {
            const result = getFavicon('https://blog.example.com')
            expect(result).toBe('https://www.google.com/s2/favicons?domain=blog.example.com&sz=32')
        })

        it('should handle www prefix', () => {
            const result = getFavicon('https://www.example.com')
            expect(result).toBe('https://www.google.com/s2/favicons?domain=www.example.com&sz=32')
        })

        it('should return null for null input', () => {
            expect(getFavicon(null)).toBeNull()
        })

        it('should return null for empty string', () => {
            expect(getFavicon('')).toBeNull()
        })

        it('should return null for invalid URL', () => {
            expect(getFavicon('not-a-valid-url')).toBeNull()
        })

        it('should return null for non-http(s) protocols', () => {
            expect(getFavicon('file:///path/to/file')).toBeNull()
            expect(getFavicon('ftp://example.com')).toBeNull()
            expect(getFavicon('mailto:test@example.com')).toBeNull()
        })

        it('should handle HTTP URLs', () => {
            const result = getFavicon('http://example.com')
            expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32')
        })
    })

    describe('formatUrl', () => {
        it('should remove https:// prefix', () => {
            expect(formatUrl('https://example.com')).toBe('example.com')
        })

        it('should remove http:// prefix', () => {
            expect(formatUrl('http://example.com')).toBe('example.com')
        })

        it('should remove www. prefix', () => {
            expect(formatUrl('https://www.example.com')).toBe('example.com')
        })

        it('should remove trailing slash', () => {
            expect(formatUrl('https://example.com/')).toBe('example.com')
        })

        it('should preserve path without trailing slash', () => {
            expect(formatUrl('https://example.com/path')).toBe('example.com/path')
        })

        it('should remove trailing slash from path', () => {
            expect(formatUrl('https://example.com/path/')).toBe('example.com/path')
        })

        it('should handle complex URLs', () => {
            expect(formatUrl('https://www.example.com/path/to/page/')).toBe('example.com/path/to/page')
        })

        it('should preserve query parameters', () => {
            expect(formatUrl('https://example.com/path?query=value')).toBe('example.com/path?query=value')
        })

        it('should return original string for invalid URL', () => {
            expect(formatUrl('not-a-url')).toBe('not-a-url')
        })
    })

    describe('getSiteName', () => {
        it('should extract hostname from URL', () => {
            expect(getSiteName('https://example.com')).toBe('example.com')
        })

        it('should remove www. prefix from hostname', () => {
            expect(getSiteName('https://www.example.com')).toBe('example.com')
        })

        it('should handle subdomains', () => {
            expect(getSiteName('https://blog.example.com')).toBe('blog.example.com')
        })

        it('should ignore path in URL', () => {
            expect(getSiteName('https://example.com/path/to/page')).toBe('example.com')
        })

        it('should ignore query parameters', () => {
            expect(getSiteName('https://example.com?query=value')).toBe('example.com')
        })

        it('should handle ports in URL', () => {
            expect(getSiteName('https://example.com:8080')).toBe('example.com')
        })

        it('should return original string for invalid URL', () => {
            expect(getSiteName('not-a-url')).toBe('not-a-url')
        })

        it('should handle HTTP URLs', () => {
            expect(getSiteName('http://example.com')).toBe('example.com')
        })
    })
})
