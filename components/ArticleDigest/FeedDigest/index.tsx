import classNames from 'classnames'
import gql from 'graphql-tag'
import Link from 'next/link'

import { toPath } from '~/common/utils'
import { Title } from '~/components'

import { UserDigest } from '../../UserDigest'
import Actions from '../Actions'
import { FeedDigestArticle } from './__generated__/FeedDigestArticle'
import styles from './styles.css'

const fragments = {
  article: gql`
    fragment FeedDigestArticle on Article {
      id
      title
      slug
      cover
      summary
      mediaHash
      author {
        userName
        ...UserDigestMiniUser
      }
      ...FeedDigestActionsArticle
    }
    ${UserDigest.Mini.fragments.user}
    ${Actions.fragments.feedDigest}
  `
}

const FeedDigest = ({ article }: { article: FeedDigestArticle }) => {
  const { cover, author, slug, mediaHash, title, summary } = article
  const path = toPath({
    page: 'articleDetail',
    userName: author.userName,
    slug,
    mediaHash
  })
  const contentClasses = classNames({
    content: true,
    'no-cover': !cover
  })

  return (
    <section className="container">
      <div className="header">
        <UserDigest.Mini user={author} />
      </div>

      <div className={contentClasses}>
        <div className="title">
          <Link href={path.fs} as={path.url}>
            <a>
              <Title type="feed" is="h2">
                {title}
              </Title>
            </a>
          </Link>
        </div>
        <div className="description">
          <Link href={path.fs} as={path.url}>
            <a>
              <p>{summary}</p>
            </a>
          </Link>

          <Actions article={article} type="feed" />
        </div>

        {cover && (
          <Link href={path.fs} as={path.url}>
            <a>
              <div
                className="cover"
                style={{
                  backgroundImage: `url(${cover})`
                }}
              />
            </a>
          </Link>
        )}
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

FeedDigest.fragments = fragments

export default FeedDigest