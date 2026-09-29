import { getApiErrorMessage } from './client'

describe('API error handling', () => {
  it('includes backend validation detail and request reference', () => {
    const message = getApiErrorMessage({
      response: {
        status: 400,
        data: { detail: 'Target resolution included a non-public address; diagnostics stopped.' },
        headers: { 'x-request-id': 'INC-4001' }
      }
    })

    expect(message).toContain('non-public address')
    expect(message).toContain('INC-4001')
  })

  it('distinguishes request timeouts', () => {
    expect(
      getApiErrorMessage({
        code: 'ECONNABORTED'
      })
    ).toMatch(/timed out/i)
  })

  it('uses a safe server-error message with request reference', () => {
    const message = getApiErrorMessage({
      response: {
        status: 503,
        data: { detail: 'internal database detail that should not be echoed' },
        headers: { 'x-request-id': 'REQ-503' }
      }
    })

    expect(message).toMatch(/backend could not complete/i)
    expect(message).toContain('REQ-503')
    expect(message).not.toContain('internal database detail')
  })
})
