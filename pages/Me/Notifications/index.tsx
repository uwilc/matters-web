import gql from 'graphql-tag'
import _get from 'lodash/get'
import { Query, QueryResult } from 'react-apollo'

import {
  Error,
  Footer,
  Head,
  InfiniteScroll,
  PageHeader,
  Spinner,
  Translate
} from '~/components'
import NoticeDigest from '~/components/NoticeDigest'

import { mergeConnections } from '~/common/utils'

import { MeNotifications } from './__generated__/MeNotifications'
import styles from './styles.css'

const ME_NOTIFICATIONS = gql`
  query MeNotifications($cursor: String) {
    viewer {
      id
      notices(input: { first: 20, after: $cursor }) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            ...DigestNotice
          }
        }
      }
    }
  }
  ${NoticeDigest.fragments.notice}
`

const Tags = () => (
  <main className="l-row">
    <article className="l-col-4 l-col-md-5 l-col-lg-8">
      <Head title={{ zh_hant: '全部通知', zh_hans: '全部通知' }} />

      <PageHeader
        pageTitle={<Translate zh_hant="全部通知" zh_hans="全部通知" />}
      />

      <section>
        <Query query={ME_NOTIFICATIONS}>
          {({
            data,
            loading,
            error,
            fetchMore
          }: QueryResult & { data: MeNotifications }) => {
            if (loading) {
              return <Spinner />
            }

            if (error) {
              return <Error error={error} />
            }

            const connectionPath = 'viewer.notices'
            const { edges, pageInfo } = _get(data, connectionPath)
            const loadMore = () =>
              fetchMore({
                variables: {
                  cursor: pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) =>
                  mergeConnections({
                    oldData: previousResult,
                    newData: fetchMoreResult,
                    path: connectionPath
                  })
              })

            if (edges.length <= 0) {
              return null
            }

            return (
              <InfiniteScroll
                hasNextPage={pageInfo.hasNextPage}
                loadMore={loadMore}
                loading={loading}
                loader={<Spinner />}
              >
                <div className="l-row">
                  <ul className="l-col-2 l-col-sm-4 l-col-lg-6">
                    {edges.map(
                      ({ node, cursor }: { node: any; cursor: any }) => (
                        <li key={cursor}>
                          <NoticeDigest notice={node} />
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </InfiniteScroll>
            )
          }}
        </Query>
      </section>
    </article>

    <aside className="l-col-4 l-col-md-3 l-col-lg-4">
      <Footer />
    </aside>

    <style jsx>{styles}</style>
  </main>
)

export default Tags
