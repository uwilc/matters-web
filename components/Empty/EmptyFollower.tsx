import { Empty, Icon, Translate } from '~/components'

import ICON_EMPTY_WARNING from '~/static/icons/empty-warning.svg?sprite'

const EmptyFollower = ({ description }: { description?: React.ReactNode }) => (
  <Empty
    icon={
      <Icon
        id={ICON_EMPTY_WARNING.id}
        viewBox={ICON_EMPTY_WARNING.viewBox}
        size={'xxlarge'}
      />
    }
    description={
      description || <Translate zh_hant="還沒有追蹤者" zh_hans="还没有追踪者" />
    }
  />
)

export default EmptyFollower