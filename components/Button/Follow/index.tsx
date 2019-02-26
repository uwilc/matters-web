import gql from 'graphql-tag'

import { FollowButtonUser } from './__generated__/FollowButtonUser'
import Follow from './Follow'
import FollowState from './FollowState'
import Unfollow from './Unfollow'

const fragments = {
  user: gql`
    fragment FollowButtonUser on User {
      id
      isFollower
      isFollowee
    }
  `
}

export const FollowButton = ({ user }: { user: FollowButtonUser }) => {
  if (user.isFollowee) {
    return <Unfollow user={user} />
  } else {
    return <Follow user={user} />
  }
}

FollowButton.fragments = fragments
FollowButton.State = FollowState