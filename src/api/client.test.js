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

  it('shows backend diagnostic timeout with request reference', () => {
    const message = getApiErrorMessage({
      response: {
        status: 504,
        data: { detail: 'Diagnostic execution timed out before completion.' },
        headers: { 'x-request-id': 'TIMEOUT-7' }
      }
    })

    expect(message).toContain('timed out')
    expect(message).toContain('TIMEOUT-7')
  })

  it('shows safe persistence failure detail with request reference', () => {
    const message = getApiErrorMessage({
      response: {
        status: 503,
        data: { detail: 'Diagnostics completed but could not be saved.' },
        headers: { 'x-request-id': 'DB-FAIL-1' }
      }
    })

    expect(message).toContain('could not be saved')
    expect(message).toContain('DB-FAIL-1')
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
