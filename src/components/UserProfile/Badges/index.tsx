import { Button, Tooltip, Translate, withIcon } from '~/components'

import { EXTERNAL_LINKS } from '~/common/enums'

import { ReactComponent as IconSeedBadge } from '@/public/static/icons/16px/early-user-badge.svg'
import { ReactComponent as IconCivicLikerBadge } from '@/public/static/icons/civic-liker-badge.svg'

import styles from './styles.css'

export const SeedBadge = () => (
  <Tooltip
    content={
      <Translate zh_hant="種子用戶" zh_hans="种子用户" en="seed users" />
    }
  >
    <span className="seed-badge">
      {withIcon(IconSeedBadge)({})}
      <style jsx>{styles}</style>
    </span>
  </Tooltip>
)

export const CivicLikerBadge = () => (
  <Button htmlHref={EXTERNAL_LINKS.CIVIC_LIKER_SUPPORT} htmlTarget="_blank">
    {withIcon((props) => (
      <IconCivicLikerBadge style={{ width: 67, height: 16 }} {...props} />
    ))({})}
  </Button>
)
