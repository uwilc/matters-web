import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React from 'react'

import {
  ArticleDigestTitle,
  Card,
  Comment,
  Expandable,
  TextIcon,
  Translate,
  UserDigest,
} from '~/components'
import CLIENT_PREFERENCE from '~/components/GQL/queries/clientPreference'

import { toPath } from '~/common/utils'

import styles from './styles.css'

import { ClientPreference } from '~/components/GQL/queries/__generated__/ClientPreference'
import { FollowComment as FollowCommentType } from './__generated__/FollowComment'

interface FollowCommentProps {
  comment: FollowCommentType
  onClickComment?: () => any
  onClickArticle?: () => void
  onClickAuthor?: () => void
}

const fragments = {
  comment: gql`
    fragment FollowComment on Comment {
      id
      author {
        id
        ...UserDigestMiniUser
      }
      node {
        ... on Article {
          id
          ...ArticleDigestTitleArticle
        }
      }
      ...CreatedAtComment
      ...ContentCommentPublic
      ...ContentCommentPrivate
      ...FooterActionsCommentPublic
      ...FooterActionsCommentPrivate
    }

    ${UserDigest.Mini.fragments.user}
    ${ArticleDigestTitle.fragments.article}
    ${Comment.CreatedAt.fragments.comment}
    ${Comment.Content.fragments.comment.public}
    ${Comment.Content.fragments.comment.private}
    ${Comment.FooterActions.fragments.comment.public}
    ${Comment.FooterActions.fragments.comment.private}
  `,
}

const FollowComment: React.FC<FollowCommentProps> = ({
  comment,
  onClickComment,
  onClickArticle,
  onClickAuthor,
}) => {
  const { data } = useQuery<ClientPreference>(CLIENT_PREFERENCE, {
    variables: { id: 'local' },
  })
  const { viewMode } = data?.clientPreference || { viewMode: 'comfortable' }
  const isDefaultMode = viewMode === 'default'

  const article =
    comment.node.__typename === 'Article' ? comment.node : undefined

  if (!article) {
    return null
  }

  const articlePath = toPath({ page: 'articleDetail', article })
  const path =
    comment.state === 'active'
      ? toPath({
          page: 'commentDetail',
          comment,
          article,
        })
      : {}

  let userDigestProps = {}
  if (isDefaultMode) {
    userDigestProps = {
      avatarSize: 'lg',
      textSize: 'md-s',
      textWeight: 'md',
    }
  } else {
    userDigestProps = {
      avatarSize: 'sm',
      textSize: 'sm',
    }
  }

  return (
    <Card {...articlePath} spacing={['base', 'base']} onClick={onClickArticle}>
      <header>
        <section className="left">
          <UserDigest.Mini
            user={comment.author}
            avatarSize="lg"
            textSize="md-s"
            textWeight="md"
            hasAvatar
            hasDisplayName
            onClick={onClickAuthor}
            {...userDigestProps}
          />
          <TextIcon size="sm" color="grey-dark">
            <Translate zh_hant="評論了" zh_hans="评论了" en="commented" />
          </TextIcon>
        </section>

        <Comment.CreatedAt comment={comment} />
      </header>

      <section className="article-title">
        <ArticleDigestTitle article={article} onClick={onClickArticle} />
      </section>

      <section className="comment-content">
        <Card
          {...path}
          bgColor="grey-lighter"
          spacing={['xtight', 'base']}
          borderRadius="xtight"
          onClick={onClickComment}
        >
          <Expandable limit={5} buffer={2}>
            <Comment.Content comment={comment} type="article" size="md-s" />
          </Expandable>
        </Card>
      </section>

      <Comment.FooterActions comment={comment} type="article" inCard />

      <style jsx>{styles}</style>
    </Card>
  )
}

/**
 * Memoizing
 */
type MemoizedFollowCommentType = React.MemoExoticComponent<
  React.FC<FollowCommentProps>
> & {
  fragments: typeof fragments
}

const MemoizedFollowComment = React.memo(
  FollowComment,
  ({ comment: prevComment }, { comment }) => {
    return (
      prevComment.upvotes === comment.upvotes &&
      prevComment.downvotes === comment.downvotes
    )
  }
) as MemoizedFollowCommentType

MemoizedFollowComment.fragments = fragments

export default MemoizedFollowComment
