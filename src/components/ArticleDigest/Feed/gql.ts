import gql from 'graphql-tag'

import { CircleDigest } from '~/components/CircleDigest'
import { UserDigest } from '~/components/UserDigest'

import DropdownActions from '../DropdownActions'
import FooterActions from '../FooterActions'
import { ArticleDigestTitle } from '../Title'
import CreatedAt from './CreatedAt'
import InactiveState from './InactiveState'
import LimitedFree from './LimitedFree'

export const fragments = {
  article: {
    public: gql`
      fragment ArticleDigestFeedArticlePublic on Article {
        id
        title
        slug
        mediaHash
        articleState: state
        cover
        summary
        author {
          id
          userName
          ...UserDigestMiniUser
        }
        circle {
          id
          name
          ...DigestPlainCircle
        }
        ...CreatedAtArticle
        ...LimitedFreeArticle
        ...InactiveStateArticle
        ...ArticleDigestTitleArticle
        ...DropdownActionsArticle
        ...FooterActionsArticlePublic
      }
      ${UserDigest.Mini.fragments.user}
      ${CreatedAt.fragments.article}
      ${LimitedFree.fragments.article}
      ${InactiveState.fragments.article}
      ${ArticleDigestTitle.fragments.article}
      ${DropdownActions.fragments.article}
      ${FooterActions.fragments.article.public}
      ${CircleDigest.Plain.fragments.circle}
    `,
    private: gql`
      fragment ArticleDigestFeedArticlePrivate on Article {
        id
        ...FooterActionsArticlePrivate
      }
      ${FooterActions.fragments.article.private}
    `,
  },
}
