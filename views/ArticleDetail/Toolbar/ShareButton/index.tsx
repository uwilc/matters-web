import { Icon } from '~/components'
import { ModalSwitch } from '~/components/ModalManager'

import ICON_SHARE from '~/static/icons/share.svg?sprite'

const ShareButton = () => (
  <>
    <ModalSwitch modalId="shareModal">
      {(open: any) => (
        <button type="button" aria-label="分享" onClick={() => open()}>
          <Icon
            size="default"
            id={ICON_SHARE.id}
            viewBox={ICON_SHARE.viewBox}
          />
        </button>
      )}
    </ModalSwitch>
  </>
)

export default ShareButton