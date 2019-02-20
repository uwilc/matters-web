import gql from 'graphql-tag'
import _get from 'lodash/get'
import { Query, QueryResult } from 'react-apollo'

import {
  ArticleDigest,
  InfiniteScroll,
  PageHeader,
  Spinner,
  Translate
} from '~/components'
import EmptySearch from '../EmptySearch'
import ViewAll from '../ViewAll'

import { mergeConnections } from '~/common/utils'
import { SeachArticles } from './__generated__/SeachArticles'

const SEARCH_ARTICLES = gql`
  query SeachArticles($key: String!, $first: Int!, $cursor: String) {
    search(input: { key: $key, type: Article, first: $first, after: $cursor }) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          ... on Article {
            ...FeedDigestArticle
          }
        }
      }
    }
  }
  ${ArticleDigest.Feed.fragments.article}
`

const SearchArticles = ({
  q,
  isAggregate
}: {
  q: string
  isAggregate: boolean
}) => {
  return (
    <Query
      query={SEARCH_ARTICLES}
      variables={{ key: q, first: isAggregate ? 5 : 10 }}
    >
      {({
        data,
        loading,
        error,
        fetchMore
      }: QueryResult & { data: SeachArticles }) => {
        if (loading) {
          return <Spinner />
        }

        if (error) {
          return <span>{JSON.stringify(error)}</span> // TODO
        }

        const connectionPath = 'search'
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
          return (
            <EmptySearch
              inSidebar={false}
              description="沒有找到你搜索的內容。"
            />
          )
        }

        return (
          <InfiniteScroll
            hasNextPage={!isAggregate && pageInfo.hasNextPage}
            loadMore={loadMore}
            loading={loading}
            loader={<Spinner />}
          >
            <PageHeader
              is="h2"
              pageTitle={
                <Translate
                  translations={{ zh_hant: '文章', zh_hans: '文章' }}
                />
              }
            >
              {isAggregate && pageInfo.hasNextPage && (
                <ViewAll q={q} type="article" />
              )}
            </PageHeader>
            <ul>
              {edges.map(({ node, cursor }: { node: any; cursor: any }) => (
                <li key={cursor}>
                  <ArticleDigest.Feed article={node} />
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        )
      }}
    </Query>
  )
}

export default SearchArticles
