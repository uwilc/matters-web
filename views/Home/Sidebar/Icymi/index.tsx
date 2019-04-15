import gql from 'graphql-tag'
import _get from 'lodash/get'
import { QueryResult } from 'react-apollo'

import { ArticleDigest, Label, Placeholder, Translate } from '~/components'
import { Query } from '~/components/GQL'

import { ANALYTICS_EVENTS, FEED_TYPE } from '~/common/enums'
import { analytics } from '~/common/utils'

import { SidebarIcymi } from './__generated__/SidebarIcymi'

const SIDEBAR_ICYMI = gql`
  query SidebarIcymi(
    $hasArticleDigestActionAuthor: Boolean = false
    $hasArticleDigestActionBookmark: Boolean = false
    $hasArticleDigestCover: Boolean = true
    $hasArticleDigestActionTopicScore: Boolean = false
  ) {
    viewer {
      id
      recommendation {
        icymi(input: { first: 5 }) {
          edges {
            cursor
            node {
              ...SidebarDigestArticle
            }
          }
        }
      }
    }
  }
  ${ArticleDigest.Sidebar.fragments.article}
`

export default () => (
  <Query query={SIDEBAR_ICYMI}>
    {({ data, loading, error }: QueryResult & { data: SidebarIcymi }) => {
      if (loading) {
        return <Placeholder.Sidebar />
      }

      const edges = _get(data, 'viewer.recommendation.icymi.edges', [])

      if (!edges || edges.length <= 0) {
        return null
      }

      return (
        <>
          <header>
            <Label>
              <Translate zh_hant="不要錯過" zh_hans="不要错过" />
            </Label>
          </header>

          <ul>
            {edges.map(
              ({ node, cursor }: { node: any; cursor: any }, i: number) => (
                <li
                  key={cursor}
                  onClick={() =>
                    analytics.trackEvent(ANALYTICS_EVENTS.CLICK_FEED, {
                      type: FEED_TYPE.ICYMI,
                      location: i
                    })
                  }
                >
                  <ArticleDigest.Sidebar article={node} hasCover />
                </li>
              )
            )}
          </ul>
        </>
      )
    }}
  </Query>
)