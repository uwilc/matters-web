import { useQuery } from '@apollo/react-hooks'
import classNames from 'classnames'
import React from 'react'

import { Card, IconPin24, Img, TextIcon, Translate } from '~/components'
import { CircleDigest } from '~/components/CircleDigest'
import CLIENT_PREFERENCE from '~/components/GQL/queries/clientPreference'
import { UserDigest } from '~/components/UserDigest'
import { UserDigestMiniProps } from '~/components/UserDigest/Mini'

import { stripHtml, toPath } from '~/common/utils'

import FooterActions, { FooterActionsControls } from '../FooterActions'
import { ArticleDigestTitle } from '../Title'
import CreatedAt from './CreatedAt'
import { fragments } from './gql'
import InactiveState from './InactiveState'
import LimitedFree from './LimitedFree'
import styles from './styles.css'

import { ClientPreference } from '~/components/GQL/queries/__generated__/ClientPreference'
import { ArticleDigestFeedArticlePrivate } from './__generated__/ArticleDigestFeedArticlePrivate'
import { ArticleDigestFeedArticlePublic } from './__generated__/ArticleDigestFeedArticlePublic'

type ExtraHeaderControls = {
  extraHeader?: React.ReactNode
  hasCircle?: boolean
}

export type ArticleDigestFeedControls = {
  onClick?: () => any
  onClickAuthor?: () => void
} & ExtraHeaderControls &
  FooterActionsControls

export type ArticleDigestFeedProps = {
  article: ArticleDigestFeedArticlePublic &
    Partial<ArticleDigestFeedArticlePrivate>

  actor?: (props: Partial<UserDigestMiniProps>) => React.ReactNode
} & ArticleDigestFeedControls

const BaseArticleDigestFeed = ({
  article,

  actor,

  hasCircle = true,
  extraHeader,

  onClick,
  onClickAuthor,

  ...controls
}: ArticleDigestFeedProps) => {
  const { data } = useQuery<ClientPreference>(CLIENT_PREFERENCE, {
    variables: { id: 'local' },
  })
  const { viewMode } = data?.clientPreference || { viewMode: 'comfortable' }
  const isCompactMode = viewMode === 'compact'
  const isDefaultMode = viewMode === 'default'

  const { author, summary, sticky, circle } = article
  const isBanned = article.articleState === 'banned'
  const cover = !isBanned ? article.cover : null
  const cleanedSummary = isBanned ? '' : stripHtml(summary)
  const path = toPath({
    page: 'articleDetail',
    article,
  })
  const containerClasses = classNames({
    [`mode-${viewMode}`]: !!viewMode,
  })

  let userDigestProps = {}
  if (isCompactMode) {
    userDigestProps = {
      avatarSize: 'sm',
      textSize: 'sm',
    }
  } else {
    userDigestProps = {
      avatarSize: 'lg',
      textSize: 'md-s',
      textWeight: 'md',
    }
  }

  return (
    <Card {...path} spacing={['base', 'base']} onClick={onClick}>
      <section className={containerClasses}>
        {extraHeader ||
          (hasCircle && circle && (
            <section className="extraHeader">
              <CircleDigest.Plain circle={circle} />

              <LimitedFree article={article} />
            </section>
          ))}

        <header>
          <section className="left">
            {actor ? (
              actor(userDigestProps)
            ) : (
              <UserDigest.Mini
                user={author}
                hasAvatar
                hasDisplayName
                onClick={onClickAuthor}
                {...userDigestProps}
              />
            )}
          </section>

          <section className="right">
            {!hasCircle && <LimitedFree article={article} />}

            {controls.inUserArticles && sticky && (
              <TextIcon icon={<IconPin24 />} size="sm" color="grey" weight="md">
                <Translate id="stickyArticle" />
              </TextIcon>
            )}

            {controls.inUserArticles && <InactiveState article={article} />}
            <CreatedAt article={article} />
          </section>
        </header>

        <section className="title">
          <ArticleDigestTitle
            article={article}
            textSize={isCompactMode ? 'md' : 'xm'}
          />
        </section>

        {!isCompactMode && (
          <section className="content">
            {cover && (
              <div className="cover">
                <Img
                  url={cover}
                  size={isDefaultMode ? '540w' : '144w'}
                  smUpSize={isDefaultMode ? '1080w' : '360w'}
                />
              </div>
            )}
            {<p className="description">{cleanedSummary}</p>}
          </section>
        )}

        <FooterActions article={article} inCard {...controls} />

        <style jsx>{styles}</style>
      </section>
    </Card>
  )
}

/**
 * Memoizing
 */
type MemoizedArticleDigestFeed = React.MemoExoticComponent<
  React.FC<ArticleDigestFeedProps>
> & {
  fragments: typeof fragments
}

export const ArticleDigestFeed = React.memo(
  BaseArticleDigestFeed,
  ({ article: prevArticle }, { article }) => {
    return (
      prevArticle.subscribed === article.subscribed &&
      prevArticle.articleState === article.articleState &&
      prevArticle.sticky === article.sticky &&
      prevArticle.appreciationsReceivedTotal ===
        article.appreciationsReceivedTotal
    )
  }
) as MemoizedArticleDigestFeed

ArticleDigestFeed.fragments = fragments
