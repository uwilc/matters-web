interface ModalInstanceProps {
  detail: CustomEvent['detail']
  close: () => void
  interpret: () => string
  closeable: boolean
  setCloseable: (value: boolean) => {}
  setModalClass: (value: string) => {}
}
