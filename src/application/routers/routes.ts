import { ComponentType } from 'react'

import { HomePageView, RepairsPageView, RepairDetailPageView, RepairCreatePageView } from '@/presentation/pages/pages'

export const ROUTES = {
  HOME: '/',
  REPAIRS: '/repairs',
  REPAIR_DETAIL: '/repairs/:id',
  REPAIR_CREATE: '/repairs/new',
} as const

export const ROUTE_PAGES: Record<RoutePath, ComponentType> = {
  [ROUTES.HOME]: HomePageView,
  [ROUTES.REPAIRS]: RepairsPageView,
  [ROUTES.REPAIR_DETAIL]: RepairDetailPageView,
  [ROUTES.REPAIR_CREATE]: RepairCreatePageView,
}

export type RouteKey = keyof typeof ROUTES

export type RoutePath = (typeof ROUTES)[RouteKey]

/**
 * 라우트 경로를 생성하는 함수
 * @param routeName 라우트 이름 (ROUTES 객체의 키 값)
 * @param pathParams 경로 매개변수 (예: /users/:id에서 id 값)
 * @param queryParams 쿼리 매개변수 객체 (예: ?key=value)
 * @returns 완성된 URL 경로
 */

export const buildRoute = (
  routeName: RouteKey,
  pathParams: Record<string, string> = {},
  queryParams: Record<string, string> = {}
): string => {
  let path = ROUTES[routeName] as string

  Object.entries(pathParams).forEach(([key, value]) => {
    const paramRegex = new RegExp(`:${key}`, 'g')
    path = path.replace(paramRegex, encodeURIComponent(value))
  })

  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  if (queryString) {
    path += `?${queryString}`
  }

  return path
}
