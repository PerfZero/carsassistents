const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api.example.com/survey'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || !import.meta.env.VITE_API_ENDPOINT || import.meta.env.VITE_API_ENDPOINT === 'https://api.example.com/survey'
const REQUEST_TIMEOUT = 3000

const logRequest = (data) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] API Request:`, JSON.stringify(data, null, 2))
}

const logResponse = (response, data) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] API Response [${response.status}]:`, JSON.stringify(data, null, 2))
}

const mockApiResponse = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      logRequest(data)
      const mockResponse = {
        code: 'OK',
        message: { text: '' }
      }
      logResponse({ status: 200 }, mockResponse)
      resolve({
        success: true,
        code: 'OK',
        message: { text: '' }
      })
    }, 500)
  })
}

export const submitSurveyResults = async (data) => {
  if (USE_MOCK_API) {
    console.log('[MOCK API] Using mock API response')
    return await mockApiResponse(data)
  }

  logRequest(data)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const responseData = await response.json()
    logResponse(response, responseData)

    if (response.status === 200) {
      return {
        success: true,
        code: responseData.code || 'OK',
        message: responseData.message || { text: '' }
      }
    } else if (response.status === 500) {
      return {
        success: false,
        code: responseData.code || 'SERVER_ERROR',
        message: responseData.message || {
          text: 'Сервис временно недоступен. Извините, наш сервис в данный момент недоступен. Попробуйте повторить попытку позже'
        }
      }
    } else {
      return {
        success: false,
        code: 'UNKNOWN_ERROR',
        message: { text: 'Произошла неизвестная ошибка' }
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      logResponse({ status: 'TIMEOUT' }, { error: 'Request timeout' })
      return {
        success: false,
        code: 'TIMEOUT',
        message: {
          text: 'Сервис временно недоступен. Извините, наш сервис в данный момент недоступен. Попробуйте повторить попытку позже'
        }
      }
    }

    logResponse({ status: 'ERROR' }, { error: error.message })
    return {
      success: false,
      code: 'SERVER_ERROR',
      message: {
        text: 'Сервис временно недоступен. Извините, наш сервис в данный момент недоступен. Попробуйте повторить попытку позже'
      }
    }
  }
}

