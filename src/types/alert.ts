export interface AlertProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onConfirm: () => void
  readonly title?: string
  readonly description?: string
  readonly confirmText?: string
  readonly cancelText?: string
  readonly isLoading?: boolean
}
