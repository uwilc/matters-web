import gql from 'graphql-tag'

import { Button, Translate } from '~/components'

import { FollowStateUser } from './__generated__/FollowStateUser'

const FollowState = ({ user }: { user: FollowStateUser }) => {
  if (!user.isFollower) {
    return null
  }

  return (
    <Button
      size="small"
      is="span"
      outlineColor="grey"
      style={{ borderWidth: 1, width: '4rem' }}
    >
      {user.isFollowee ? (
        <Translate zh_hant="互相追蹤" zh_hans="互相追踪" />
      ) : (
        <Translate zh_hant="追蹤了你" zh_hans="追踪了你" />
      )}
    </Button>
  )
}

FollowState.fragments = {
  user: gql`
    fragment FollowStateUser on User {
      id
      isFollower
      isFollowee
    }
  `
}

export default FollowState