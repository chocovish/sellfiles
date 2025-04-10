/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VishalImport } from './routes/vishal'
import { Route as TermsImport } from './routes/terms'
import { Route as PrivacyImport } from './routes/privacy'
import { Route as DashboardRouteImport } from './routes/dashboard/route'
import { Route as AuthRouteImport } from './routes/auth/route'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as DashboardProductsImport } from './routes/dashboard/products'
import { Route as AuthSignUpSuccessImport } from './routes/auth/sign-up-success'
import { Route as AuthSignUpImport } from './routes/auth/sign-up'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as AuthForgotPasswordImport } from './routes/auth/forgot-password'
import { Route as DashboardMyprofileRouteImport } from './routes/dashboard/myprofile/route'
import { Route as ShopSlugIndexImport } from './routes/shop/$slug/index'
import { Route as DashboardMyprofileIndexImport } from './routes/dashboard/myprofile/index'
import { Route as ShopSlugProductIdImport } from './routes/shop/$slug/$productId'
import { Route as DashboardMyprofileWithdrawalsImport } from './routes/dashboard/myprofile/withdrawals'
import { Route as DashboardMyprofilePurchasesImport } from './routes/dashboard/myprofile/purchases'
import { Route as DashboardMyprofilePaymentImport } from './routes/dashboard/myprofile/payment'

// Create/Update Routes

const VishalRoute = VishalImport.update({
  id: '/vishal',
  path: '/vishal',
  getParentRoute: () => rootRoute,
} as any)

const TermsRoute = TermsImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => rootRoute,
} as any)

const PrivacyRoute = PrivacyImport.update({
  id: '/privacy',
  path: '/privacy',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRouteRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AuthRouteRoute = AuthRouteImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardProductsRoute = DashboardProductsImport.update({
  id: '/products',
  path: '/products',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const AuthSignUpSuccessRoute = AuthSignUpSuccessImport.update({
  id: '/sign-up-success',
  path: '/sign-up-success',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthSignUpRoute = AuthSignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AuthRouteRoute,
} as any)

const AuthForgotPasswordRoute = AuthForgotPasswordImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => AuthRouteRoute,
} as any)

const DashboardMyprofileRouteRoute = DashboardMyprofileRouteImport.update({
  id: '/myprofile',
  path: '/myprofile',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const ShopSlugIndexRoute = ShopSlugIndexImport.update({
  id: '/shop/$slug/',
  path: '/shop/$slug/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardMyprofileIndexRoute = DashboardMyprofileIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardMyprofileRouteRoute,
} as any)

const ShopSlugProductIdRoute = ShopSlugProductIdImport.update({
  id: '/shop/$slug/$productId',
  path: '/shop/$slug/$productId',
  getParentRoute: () => rootRoute,
} as any)

const DashboardMyprofileWithdrawalsRoute =
  DashboardMyprofileWithdrawalsImport.update({
    id: '/withdrawals',
    path: '/withdrawals',
    getParentRoute: () => DashboardMyprofileRouteRoute,
  } as any)

const DashboardMyprofilePurchasesRoute =
  DashboardMyprofilePurchasesImport.update({
    id: '/purchases',
    path: '/purchases',
    getParentRoute: () => DashboardMyprofileRouteRoute,
  } as any)

const DashboardMyprofilePaymentRoute = DashboardMyprofilePaymentImport.update({
  id: '/payment',
  path: '/payment',
  getParentRoute: () => DashboardMyprofileRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRoute
    }
    '/privacy': {
      id: '/privacy'
      path: '/privacy'
      fullPath: '/privacy'
      preLoaderRoute: typeof PrivacyImport
      parentRoute: typeof rootRoute
    }
    '/terms': {
      id: '/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof TermsImport
      parentRoute: typeof rootRoute
    }
    '/vishal': {
      id: '/vishal'
      path: '/vishal'
      fullPath: '/vishal'
      preLoaderRoute: typeof VishalImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/myprofile': {
      id: '/dashboard/myprofile'
      path: '/myprofile'
      fullPath: '/dashboard/myprofile'
      preLoaderRoute: typeof DashboardMyprofileRouteImport
      parentRoute: typeof DashboardRouteImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordImport
      parentRoute: typeof AuthRouteImport
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthRouteImport
    }
    '/auth/sign-up': {
      id: '/auth/sign-up'
      path: '/sign-up'
      fullPath: '/auth/sign-up'
      preLoaderRoute: typeof AuthSignUpImport
      parentRoute: typeof AuthRouteImport
    }
    '/auth/sign-up-success': {
      id: '/auth/sign-up-success'
      path: '/sign-up-success'
      fullPath: '/auth/sign-up-success'
      preLoaderRoute: typeof AuthSignUpSuccessImport
      parentRoute: typeof AuthRouteImport
    }
    '/dashboard/products': {
      id: '/dashboard/products'
      path: '/products'
      fullPath: '/dashboard/products'
      preLoaderRoute: typeof DashboardProductsImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/myprofile/payment': {
      id: '/dashboard/myprofile/payment'
      path: '/payment'
      fullPath: '/dashboard/myprofile/payment'
      preLoaderRoute: typeof DashboardMyprofilePaymentImport
      parentRoute: typeof DashboardMyprofileRouteImport
    }
    '/dashboard/myprofile/purchases': {
      id: '/dashboard/myprofile/purchases'
      path: '/purchases'
      fullPath: '/dashboard/myprofile/purchases'
      preLoaderRoute: typeof DashboardMyprofilePurchasesImport
      parentRoute: typeof DashboardMyprofileRouteImport
    }
    '/dashboard/myprofile/withdrawals': {
      id: '/dashboard/myprofile/withdrawals'
      path: '/withdrawals'
      fullPath: '/dashboard/myprofile/withdrawals'
      preLoaderRoute: typeof DashboardMyprofileWithdrawalsImport
      parentRoute: typeof DashboardMyprofileRouteImport
    }
    '/shop/$slug/$productId': {
      id: '/shop/$slug/$productId'
      path: '/shop/$slug/$productId'
      fullPath: '/shop/$slug/$productId'
      preLoaderRoute: typeof ShopSlugProductIdImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/myprofile/': {
      id: '/dashboard/myprofile/'
      path: '/'
      fullPath: '/dashboard/myprofile/'
      preLoaderRoute: typeof DashboardMyprofileIndexImport
      parentRoute: typeof DashboardMyprofileRouteImport
    }
    '/shop/$slug/': {
      id: '/shop/$slug/'
      path: '/shop/$slug'
      fullPath: '/shop/$slug'
      preLoaderRoute: typeof ShopSlugIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface AuthRouteRouteChildren {
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
  AuthLoginRoute: typeof AuthLoginRoute
  AuthSignUpRoute: typeof AuthSignUpRoute
  AuthSignUpSuccessRoute: typeof AuthSignUpSuccessRoute
}

const AuthRouteRouteChildren: AuthRouteRouteChildren = {
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthLoginRoute: AuthLoginRoute,
  AuthSignUpRoute: AuthSignUpRoute,
  AuthSignUpSuccessRoute: AuthSignUpSuccessRoute,
}

const AuthRouteRouteWithChildren = AuthRouteRoute._addFileChildren(
  AuthRouteRouteChildren,
)

interface DashboardMyprofileRouteRouteChildren {
  DashboardMyprofilePaymentRoute: typeof DashboardMyprofilePaymentRoute
  DashboardMyprofilePurchasesRoute: typeof DashboardMyprofilePurchasesRoute
  DashboardMyprofileWithdrawalsRoute: typeof DashboardMyprofileWithdrawalsRoute
  DashboardMyprofileIndexRoute: typeof DashboardMyprofileIndexRoute
}

const DashboardMyprofileRouteRouteChildren: DashboardMyprofileRouteRouteChildren =
  {
    DashboardMyprofilePaymentRoute: DashboardMyprofilePaymentRoute,
    DashboardMyprofilePurchasesRoute: DashboardMyprofilePurchasesRoute,
    DashboardMyprofileWithdrawalsRoute: DashboardMyprofileWithdrawalsRoute,
    DashboardMyprofileIndexRoute: DashboardMyprofileIndexRoute,
  }

const DashboardMyprofileRouteRouteWithChildren =
  DashboardMyprofileRouteRoute._addFileChildren(
    DashboardMyprofileRouteRouteChildren,
  )

interface DashboardRouteRouteChildren {
  DashboardMyprofileRouteRoute: typeof DashboardMyprofileRouteRouteWithChildren
  DashboardProductsRoute: typeof DashboardProductsRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
}

const DashboardRouteRouteChildren: DashboardRouteRouteChildren = {
  DashboardMyprofileRouteRoute: DashboardMyprofileRouteRouteWithChildren,
  DashboardProductsRoute: DashboardProductsRoute,
  DashboardIndexRoute: DashboardIndexRoute,
}

const DashboardRouteRouteWithChildren = DashboardRouteRoute._addFileChildren(
  DashboardRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth': typeof AuthRouteRouteWithChildren
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/vishal': typeof VishalRoute
  '/dashboard/myprofile': typeof DashboardMyprofileRouteRouteWithChildren
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/sign-up-success': typeof AuthSignUpSuccessRoute
  '/dashboard/products': typeof DashboardProductsRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/myprofile/payment': typeof DashboardMyprofilePaymentRoute
  '/dashboard/myprofile/purchases': typeof DashboardMyprofilePurchasesRoute
  '/dashboard/myprofile/withdrawals': typeof DashboardMyprofileWithdrawalsRoute
  '/shop/$slug/$productId': typeof ShopSlugProductIdRoute
  '/dashboard/myprofile/': typeof DashboardMyprofileIndexRoute
  '/shop/$slug': typeof ShopSlugIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth': typeof AuthRouteRouteWithChildren
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/vishal': typeof VishalRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/sign-up-success': typeof AuthSignUpSuccessRoute
  '/dashboard/products': typeof DashboardProductsRoute
  '/dashboard': typeof DashboardIndexRoute
  '/dashboard/myprofile/payment': typeof DashboardMyprofilePaymentRoute
  '/dashboard/myprofile/purchases': typeof DashboardMyprofilePurchasesRoute
  '/dashboard/myprofile/withdrawals': typeof DashboardMyprofileWithdrawalsRoute
  '/shop/$slug/$productId': typeof ShopSlugProductIdRoute
  '/dashboard/myprofile': typeof DashboardMyprofileIndexRoute
  '/shop/$slug': typeof ShopSlugIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/auth': typeof AuthRouteRouteWithChildren
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/privacy': typeof PrivacyRoute
  '/terms': typeof TermsRoute
  '/vishal': typeof VishalRoute
  '/dashboard/myprofile': typeof DashboardMyprofileRouteRouteWithChildren
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/sign-up-success': typeof AuthSignUpSuccessRoute
  '/dashboard/products': typeof DashboardProductsRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/myprofile/payment': typeof DashboardMyprofilePaymentRoute
  '/dashboard/myprofile/purchases': typeof DashboardMyprofilePurchasesRoute
  '/dashboard/myprofile/withdrawals': typeof DashboardMyprofileWithdrawalsRoute
  '/shop/$slug/$productId': typeof ShopSlugProductIdRoute
  '/dashboard/myprofile/': typeof DashboardMyprofileIndexRoute
  '/shop/$slug/': typeof ShopSlugIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/auth'
    | '/dashboard'
    | '/privacy'
    | '/terms'
    | '/vishal'
    | '/dashboard/myprofile'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/sign-up'
    | '/auth/sign-up-success'
    | '/dashboard/products'
    | '/dashboard/'
    | '/dashboard/myprofile/payment'
    | '/dashboard/myprofile/purchases'
    | '/dashboard/myprofile/withdrawals'
    | '/shop/$slug/$productId'
    | '/dashboard/myprofile/'
    | '/shop/$slug'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth'
    | '/privacy'
    | '/terms'
    | '/vishal'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/sign-up'
    | '/auth/sign-up-success'
    | '/dashboard/products'
    | '/dashboard'
    | '/dashboard/myprofile/payment'
    | '/dashboard/myprofile/purchases'
    | '/dashboard/myprofile/withdrawals'
    | '/shop/$slug/$productId'
    | '/dashboard/myprofile'
    | '/shop/$slug'
  id:
    | '__root__'
    | '/'
    | '/auth'
    | '/dashboard'
    | '/privacy'
    | '/terms'
    | '/vishal'
    | '/dashboard/myprofile'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/sign-up'
    | '/auth/sign-up-success'
    | '/dashboard/products'
    | '/dashboard/'
    | '/dashboard/myprofile/payment'
    | '/dashboard/myprofile/purchases'
    | '/dashboard/myprofile/withdrawals'
    | '/shop/$slug/$productId'
    | '/dashboard/myprofile/'
    | '/shop/$slug/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthRouteRoute: typeof AuthRouteRouteWithChildren
  DashboardRouteRoute: typeof DashboardRouteRouteWithChildren
  PrivacyRoute: typeof PrivacyRoute
  TermsRoute: typeof TermsRoute
  VishalRoute: typeof VishalRoute
  ShopSlugProductIdRoute: typeof ShopSlugProductIdRoute
  ShopSlugIndexRoute: typeof ShopSlugIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRouteRoute: AuthRouteRouteWithChildren,
  DashboardRouteRoute: DashboardRouteRouteWithChildren,
  PrivacyRoute: PrivacyRoute,
  TermsRoute: TermsRoute,
  VishalRoute: VishalRoute,
  ShopSlugProductIdRoute: ShopSlugProductIdRoute,
  ShopSlugIndexRoute: ShopSlugIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth",
        "/dashboard",
        "/privacy",
        "/terms",
        "/vishal",
        "/shop/$slug/$productId",
        "/shop/$slug/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth": {
      "filePath": "auth/route.tsx",
      "children": [
        "/auth/forgot-password",
        "/auth/login",
        "/auth/sign-up",
        "/auth/sign-up-success"
      ]
    },
    "/dashboard": {
      "filePath": "dashboard/route.tsx",
      "children": [
        "/dashboard/myprofile",
        "/dashboard/products",
        "/dashboard/"
      ]
    },
    "/privacy": {
      "filePath": "privacy.tsx"
    },
    "/terms": {
      "filePath": "terms.tsx"
    },
    "/vishal": {
      "filePath": "vishal.tsx"
    },
    "/dashboard/myprofile": {
      "filePath": "dashboard/myprofile/route.tsx",
      "parent": "/dashboard",
      "children": [
        "/dashboard/myprofile/payment",
        "/dashboard/myprofile/purchases",
        "/dashboard/myprofile/withdrawals",
        "/dashboard/myprofile/"
      ]
    },
    "/auth/forgot-password": {
      "filePath": "auth/forgot-password.tsx",
      "parent": "/auth"
    },
    "/auth/login": {
      "filePath": "auth/login.tsx",
      "parent": "/auth"
    },
    "/auth/sign-up": {
      "filePath": "auth/sign-up.tsx",
      "parent": "/auth"
    },
    "/auth/sign-up-success": {
      "filePath": "auth/sign-up-success.tsx",
      "parent": "/auth"
    },
    "/dashboard/products": {
      "filePath": "dashboard/products.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/myprofile/payment": {
      "filePath": "dashboard/myprofile/payment.tsx",
      "parent": "/dashboard/myprofile"
    },
    "/dashboard/myprofile/purchases": {
      "filePath": "dashboard/myprofile/purchases.tsx",
      "parent": "/dashboard/myprofile"
    },
    "/dashboard/myprofile/withdrawals": {
      "filePath": "dashboard/myprofile/withdrawals.tsx",
      "parent": "/dashboard/myprofile"
    },
    "/shop/$slug/$productId": {
      "filePath": "shop/$slug/$productId.tsx"
    },
    "/dashboard/myprofile/": {
      "filePath": "dashboard/myprofile/index.tsx",
      "parent": "/dashboard/myprofile"
    },
    "/shop/$slug/": {
      "filePath": "shop/$slug/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
