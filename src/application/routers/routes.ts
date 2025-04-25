export const ROUTES = {
  HOME: '/',
  REPAIRS: '/repairs',
  KAKAO: '/kakao',
} as const

/**
 * 라우트 경로를 생성하는 함수
 * @param routeName 라우트 이름 (ROUTES 객체의 키 값)
 * @param pathParams 경로 매개변수 (예: /users/:id에서 id 값)
 * @param queryParams 쿼리 매개변수 객체 (예: ?key=value)
 * @returns 완성된 URL 경로
 */
export const buildRoute = (
  routeName: keyof typeof ROUTES,
  pathParams: Record<string, string> = {},
  queryParams: Record<string, string> = {}
): string => {
  let path = ROUTES[routeName] as string

  Object.entries(pathParams).forEach(([key, value]) => {
    path = path.replace(`:${key}`, encodeURIComponent(value))
  })

  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  if (queryString) {
    path += `?${queryString}`
  }

  return path
}
