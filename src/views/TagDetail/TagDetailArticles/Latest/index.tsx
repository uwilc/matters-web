import { useQuery } from '@apollo/react-hooks'
import _get from 'lodash/get'

import { ArticleDigest, InfiniteScroll, Spinner } from '~/components'
import EmptyTagArticles from '~/components/Empty/EmptyTagArticles'
import { QueryError } from '~/components/GQL'
import TAG_ARTICLES from '~/components/GQL/queries/tagArticles'
import { useEventListener } from '~/components/Hook'

import {
  ANALYTICS_EVENTS,
  FEED_TYPE,
  REFETCH_TAG_DETAIL_ARTICLES
} from '~/common/enums'
import { analytics, mergeConnections } from '~/common/utils'

import { TagArticles } from '~/components/GQL/queries/__generated__/TagArticles'

const LatestArticles = ({ id }: { id: string }) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<TagArticles>(
    TAG_ARTICLES,
    { variables: { id }, fetchPolicy: 'cache-and-network' }
  )

  const sync = ({
    event,
    differences = 0
  }: {
    event: 'add' | 'delete'
    differences?: number
  }) => {
    const { edges: items } = _get(data, 'node.articles', { edges: [] })
    switch (event) {
      case 'add':
        refetch({
          variables: {
            id,
            first: items.length + differences
          }
        })
        break
      case 'delete':
        refetch({
          variables: {
            id,
            first: Math.max(items.length - 1, 0)
          }
        })
        break
    }
  }

  useEventListener(REFETCH_TAG_DETAIL_ARTICLES, sync)

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <QueryError error={error} />
  }

  if (!data || !data.node || data.node.__typename !== 'Tag') {
    return <EmptyTagArticles />
  }

  const connectionPath = 'node.articles'
  const { edges, pageInfo } = data.node.articles
  const hasArticles = edges && edges.length > 0 && pageInfo

  const loadMore = () => {
    analytics.trackEvent(ANALYTICS_EVENTS.LOAD_MORE, {
      type: FEED_TYPE.TAG_DETAIL,
      location: edges ? edges.length : 0,
      entrance: id
    })
    return fetchMore({
      variables: {
        after: pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) =>
        mergeConnections({
          oldData: previousResult,
          newData: fetchMoreResult,
          path: connectionPath
        })
    })
  }

  if (!hasArticles) {
    return <EmptyTagArticles />
  }

  return (
    <section>
      <InfiniteScroll hasNextPage={pageInfo.hasNextPage} loadMore={loadMore}>
        <ul>
          {(edges || []).map(({ node, cursor }, i) => (
            <li
              key={cursor}
              onClick={() =>
                analytics.trackEvent(ANALYTICS_EVENTS.CLICK_FEED, {
                  type: FEED_TYPE.TAG_DETAIL,
                  location: i,
                  entrance: id
                })
              }
            >
              <ArticleDigest.Feed article={node} inTagDetailLatest />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </section>
  )
}

export default LatestArticles
