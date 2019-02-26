import gql from 'graphql-tag'

import { DigestNotice } from './__generated__/DigestNotice'
import ArticleNewAppreciationNotice from './ArticleNewAppreciationNotice'
import ArticleNewCommentNotice from './ArticleNewCommentNotice'
import ArticleNewDownstreamNotice from './ArticleNewDownstreamNotice'
import ArticleNewSubscriberNotice from './ArticleNewSubscriberNotice'
import ArticlePublishedNotice from './ArticlePublishedNotice'
import CommentMentionedYouNotice from './CommentMentionedYouNotice'
import CommentNewReplyNotice from './CommentNewReplyNotice'
import CommentNewUpvoteNotice from './CommentNewUpvoteNotice'
import CommentPinnedNotice from './CommentPinnedNotice'
import DownstreamArticleArchivedNotice from './DownstreamArticleArchivedNotice'
import OfficialAnnouncementNotice from './OfficialAnnouncementNotice'
import styles from './styles.css'
import SubscribedArticleNewCommentNotice from './SubscribedArticleNewCommentNotice'
import UpstreamArticleArchivedNotice from './UpstreamArticleArchivedNotice'
import UserNewFollowerNotice from './UserNewFollowerNotice'

const fragments = {
  notice: gql`
    fragment DigestNotice on Notice {
      id
      unread
      createdAt
      ... on UserNewFollowerNotice {
        ...UserNewFollowerNotice
      }
      ... on ArticlePublishedNotice {
        ...ArticlePublishedNotice
      }
      ... on ArticleNewDownstreamNotice {
        ...ArticleNewDownstreamNotice
      }
      ... on ArticleNewAppreciationNotice {
        ...ArticleNewAppreciationNotice
      }
      ... on ArticleNewSubscriberNotice {
        ...ArticleNewSubscriberNotice
      }
      ... on ArticleNewCommentNotice {
        ...ArticleNewCommentNotice
      }
      ... on SubscribedArticleNewCommentNotice {
        ...SubscribedArticleNewCommentNotice
      }
      ... on UpstreamArticleArchivedNotice {
        ...UpstreamArticleArchivedNotice
      }
      ... on DownstreamArticleArchivedNotice {
        ...DownstreamArticleArchivedNotice
      }
      ... on CommentPinnedNotice {
        ...CommentPinnedNotice
      }
      ... on CommentNewReplyNotice {
        ...CommentNewReplyNotice
      }
      ... on CommentNewUpvoteNotice {
        ...CommentNewUpvoteNotice
      }
      ... on CommentMentionedYouNotice {
        ...CommentMentionedYouNotice
      }
      ... on OfficialAnnouncementNotice {
        ...OfficialAnnouncementNotice
      }
    }
    ${ArticleNewAppreciationNotice.fragments.notice}
    ${ArticleNewCommentNotice.fragments.notice}
    ${ArticleNewDownstreamNotice.fragments.notice}
    ${ArticleNewSubscriberNotice.fragments.notice}
    ${ArticlePublishedNotice.fragments.notice}
    ${CommentMentionedYouNotice.fragments.notice}
    ${CommentNewReplyNotice.fragments.notice}
    ${CommentNewUpvoteNotice.fragments.notice}
    ${CommentPinnedNotice.fragments.notice}
    ${DownstreamArticleArchivedNotice.fragments.notice}
    ${OfficialAnnouncementNotice.fragments.notice}
    ${SubscribedArticleNewCommentNotice.fragments.notice}
    ${UpstreamArticleArchivedNotice.fragments.notice}
    ${UserNewFollowerNotice.fragments.notice}
  `
}

const FeedDigest = ({ notice }: { notice: DigestNotice }) => {
  return (
    <section className="container">
      {notice.id}

      <style jsx>{styles}</style>
    </section>
  )
}

FeedDigest.fragments = fragments

export default FeedDigest
