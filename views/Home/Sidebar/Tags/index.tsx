import gql from 'graphql-tag'
import _get from 'lodash/get'
import { QueryResult } from 'react-apollo'

import { Label, Tag, Translate } from '~/components'
import { Query } from '~/components/GQL'

import { ANALYTICS_EVENTS, FEED_TYPE } from '~/common/enums'
import { analytics } from '~/common/utils'

import ViewAllLink from '../ViewAllLink'
import { SidebarTags } from './__generated__/SidebarTags'
import styles from './styles.css'

const SIDEBAR_TAGS = gql`
  query SidebarTags {
    viewer {
      id
      recommendation {
        tags(input: { first: 8 }) {
          edges {
            cursor
            node {
              ...DigestTag
            }
          }
        }
      }
    }
  }
  ${Tag.fragments.tag}
`

export default () => (
  <>
    <Query query={SIDEBAR_TAGS}>
      {({ data, loading, error }: QueryResult & { data: SidebarTags }) => {
        const edges = _get(data, 'viewer.recommendation.tags.edges', [])

        if (!edges || edges.length <= 0) {
          return null
        }

        return (
          <>
            <header>
              <Label>
                <Translate zh_hant="標籤" zh_hans="标签" />
              </Label>
              <ViewAllLink type="tags" />
            </header>

            <ul>
              {edges.map(
                ({ node, cursor }: { node: any; cursor: any }, i: number) => (
                  <li
                    key={cursor}
                    onClick={() =>
                      analytics.trackEvent(ANALYTICS_EVENTS.CLICK_FEED, {
                        type: FEED_TYPE.TAGS,
                        location: i
                      })
                    }
                  >
                    <Tag tag={node} size="small" type="count-fixed" />
                  </li>
                )
              )}
            </ul>
          </>
        )
      }}
    </Query>
    <style jsx>{styles}</style>
  </>
)