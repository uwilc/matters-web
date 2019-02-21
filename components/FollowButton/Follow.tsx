// External modules
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

// Internal modules
import { Button, Icon, Translate } from '~/components'

import ICON_ADD from '~/static/icons/add.svg?sprite'
import { FollowStateUser } from './__generated__/FollowStateUser'

const FOLLOW_USER = gql`
  mutation FollowUser($id: ID!) {
    followUser(input: { id: $id }) {
      id
      isFollowee
      isFollower
    }
  }
`

const IconAdd = () => (
  <Icon
    id={ICON_ADD.id}
    viewBox={ICON_ADD.viewBox}
    style={{ width: 10, height: 10 }}
  />
)

const Follow = ({ user }: { user: FollowStateUser }) => (
  <Mutation
    mutation={FOLLOW_USER}
    variables={{ id: user.id }}
    optimisticResponse={{
      followUser: {
        id: user.id,
        isFollowee: true,
        isFollower: user.isFollower,
        __typename: 'User'
      }
    }}
  >
    {(follow, { data }) => (
      <Button
        size="small"
        icon={<IconAdd />}
        style={{ width: '4rem' }}
        onClick={follow}
        outlineColor="green"
      >
        <Translate zh_hant="追蹤" zh_hans="追踪" />
      </Button>
    )}
  </Mutation>
)

export default Follow
