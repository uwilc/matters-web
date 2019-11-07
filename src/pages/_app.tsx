import * as Sentry from '@sentry/browser'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import App from 'next/app'
import getConfig from 'next/config'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import {
  AnalyticsProvider,
  GlobalStyles,
  LanguageProvider,
  Layout,
  ModalProvider
} from '~/components'
import ClientPreferenceInitializer from '~/components/ClientPreferenceInitializer'
import ErrorBoundary from '~/components/ErrorBoundary'

import { initializeFirebase } from '~/common/utils'
import withApollo from '~/common/utils/withApollo'

/**
 * Initialize
 */
const {
  publicRuntimeConfig: { SENTRY_DSN }
} = getConfig()

// Sentry
Sentry.init({ dsn: SENTRY_DSN || '' })

// Firebase
initializeFirebase()

class MattersApp extends App<{ apollo: ApolloClient<InMemoryCache> }> {
  render() {
    const { Component, pageProps, apollo } = this.props

    return (
      <ErrorBoundary>
        <ApolloProvider client={apollo}>
          <LanguageProvider>
            <AnalyticsProvider>
              <ModalProvider>
                <GlobalStyles />
                <ClientPreferenceInitializer />

                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ModalProvider>
            </AnalyticsProvider>
          </LanguageProvider>
        </ApolloProvider>
      </ErrorBoundary>
    )
  }
}

export default withApollo(MattersApp)
