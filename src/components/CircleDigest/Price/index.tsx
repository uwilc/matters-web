import { toPath } from 'lodash'

import { Button, TextIcon, Translate } from '~/components'

type PriceProps = {
  // circle: PriceCircle
  circle: any
}

const Price: React.FC<PriceProps> = ({ circle }) => {
  const price = circle.prices && circle.prices[0]
  const isMember = circle.isMember
  const path = toPath({
    page: 'circleDetail',
    circle,
  })

  if (!price) {
    return null
  }

  if (isMember) {
    return (
      <Button
        size={[null, '2rem']}
        spacing={[0, 'base']}
        bgColor="green"
        {...path}
      >
        <TextIcon weight="md" size="sm" color="white">
          <Translate zh_hant="進入圍爐" zh_hans="进入围炉" />
        </TextIcon>
      </Button>
    )
  }

  return (
    <Button size={[null, '2rem']} spacing={[0, 'base']} bgColor="gold">
      <TextIcon weight="md" size="sm" color="white">
        {price.amount} {price.currency} / <Translate id="month" />
      </TextIcon>
    </Button>
  )
}

export default Price
