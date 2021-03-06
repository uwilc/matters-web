import _random from 'lodash/random'
import { useContext, useEffect } from 'react'

import {
  List,
  QueryError,
  ShuffleButton,
  Spinner,
  usePublicQuery,
  UserDigest,
  ViewerContext,
} from '~/components'

import { analytics } from '~/common/utils'

import SectionHeader from '../../SectionHeader'
import { SIDEBAR_AUTHORS } from './gql'
import styles from './styles.css'

import { SidebarAuthors } from './__generated__/SidebarAuthors'

const Authors = () => {
  const viewer = useContext(ViewerContext)

  /**
   * Data Fetching
   */
  const { data, loading, error, refetch } = usePublicQuery<SidebarAuthors>(
    SIDEBAR_AUTHORS,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        random: 0,
      },
    },
    {
      publicQuery: !viewer.isAuthed,
    }
  )
  const edges = data?.viewer?.recommendation.authors.edges

  const shuffle = () => {
    refetch({ random: _random(0, 50) })
  }

  useEffect(() => {
    if (viewer.isAuthed) {
      shuffle()
    }
  }, [viewer.isAuthed])

  /**
   * Render
   */
  if (error) {
    return <QueryError error={error} />
  }

  if (!edges || edges.length <= 0) {
    return null
  }

  return (
    <section className="container">
      <SectionHeader
        type="authors"
        rightButton={<ShuffleButton onClick={shuffle} />}
      />

      {loading && <Spinner />}

      {!loading && (
        <List hasBorder={false}>
          {edges.map(({ node, cursor }, i) => (
            <List.Item key={cursor}>
              <UserDigest.Rich
                user={node}
                spacing={['xtight', 'xtight']}
                bgColor="none"
                bgActiveColor="grey-lighter"
                borderRadius="xtight"
                onClick={() =>
                  analytics.trackEvent('click_feed', {
                    type: 'authors',
                    contentType: 'user',
                    styleType: 'card',
                    location: i,
                  })
                }
                hasState={false}
              />
            </List.Item>
          ))}
        </List>
      )}

      <style jsx>{styles}</style>
    </section>
  )
}

export default Authors
