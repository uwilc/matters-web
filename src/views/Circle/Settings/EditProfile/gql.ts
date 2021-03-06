import gql from 'graphql-tag'

import { CircleAvatar } from '~/components'

export const CIRCLE_BASIC_PROFILE = gql`
  query CircleBasicProfile($name: String!) {
    circle(input: { name: $name }) {
      id
      description
      cover
      owner {
        id
      }
      ...AvatarCircle
    }
  }
  ${CircleAvatar.fragments.circle}
`
