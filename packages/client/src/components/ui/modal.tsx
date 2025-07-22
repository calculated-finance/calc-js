import { useMediaQuery } from '@/hooks/use-media-query'
import * as React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

interface ModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dialogProps?: React.ComponentProps<typeof Dialog>
  drawerProps?: React.ComponentProps<typeof Drawer>
}

interface ModalContentProps {
  className?: string
  children: React.ReactNode
  showCloseButton?: boolean
  overlayClassName?: string
  dialogProps?: React.ComponentProps<typeof DialogContent>
  drawerProps?: React.ComponentProps<typeof DrawerContent>
}

interface ModalHeaderProps {
  className?: string
  children: React.ReactNode
  dialogProps?: React.ComponentProps<typeof DialogHeader>
  drawerProps?: React.ComponentProps<typeof DrawerHeader>
}

interface ModalFooterProps {
  className?: string
  children: React.ReactNode
  dialogProps?: React.ComponentProps<typeof DialogFooter>
  drawerProps?: React.ComponentProps<typeof DrawerFooter>
}

interface ModalTitleProps {
  className?: string
  children: React.ReactNode
  dialogProps?: React.ComponentProps<typeof DialogTitle>
  drawerProps?: React.ComponentProps<typeof DrawerTitle>
}

interface ModalDescriptionProps {
  className?: string
  children: React.ReactNode
  dialogProps?: React.ComponentProps<typeof DialogDescription>
  drawerProps?: React.ComponentProps<typeof DrawerDescription>
}

interface ModalTriggerProps {
  className?: string
  children: React.ReactNode
  asChild?: boolean
  dialogProps?: React.ComponentProps<typeof DialogTrigger>
  drawerProps?: React.ComponentProps<typeof DrawerTrigger>
}

interface ModalCloseProps {
  className?: string
  children: React.ReactNode
  asChild?: boolean
  dialogProps?: React.ComponentProps<typeof DialogClose>
  drawerProps?: React.ComponentProps<typeof DrawerClose>
}

function Modal({ children, dialogProps, drawerProps, ...props }: ModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog {...props} {...dialogProps}>
        {children}
      </Dialog>
    )
  }

  return (
    <Drawer {...props} {...drawerProps}>
      {children}
    </Drawer>
  )
}

function ModalTrigger({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalTriggerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogTrigger {...props} {...dialogProps}>
        {children}
      </DialogTrigger>
    )
  }

  return (
    <DrawerTrigger {...props} {...drawerProps}>
      {children}
    </DrawerTrigger>
  )
}

function ModalContent({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalContentProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogContent
        {...props}
        {...dialogProps}
        aria-describedby="modal-description"
      >
        {children}
      </DialogContent>
    )
  }

  return (
    <DrawerContent {...props} {...drawerProps}>
      {children}
    </DrawerContent>
  )
}

function ModalHeader({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalHeaderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogHeader {...props} {...dialogProps}>
        {children}
      </DialogHeader>
    )
  }

  return (
    <DrawerHeader {...props} {...drawerProps}>
      {children}
    </DrawerHeader>
  )
}

function ModalFooter({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalFooterProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogFooter {...props} {...dialogProps}>
        {children}
      </DialogFooter>
    )
  }

  return (
    <DrawerFooter {...props} {...drawerProps}>
      {children}
    </DrawerFooter>
  )
}

function ModalTitle({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalTitleProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogTitle {...props} {...dialogProps}>
        {children}
      </DialogTitle>
    )
  }

  return (
    <DrawerTitle {...props} {...drawerProps}>
      {children}
    </DrawerTitle>
  )
}

function ModalDescription({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalDescriptionProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogDescription {...props} {...dialogProps}>
        {children}
      </DialogDescription>
    )
  }

  return (
    <DrawerDescription {...props} {...drawerProps}>
      {children}
    </DrawerDescription>
  )
}

function ModalClose({
  children,
  dialogProps,
  drawerProps,
  ...props
}: ModalCloseProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <DialogClose {...props} {...dialogProps}>
        {children}
      </DialogClose>
    )
  }

  return (
    <DrawerClose {...props} {...drawerProps}>
      {children}
    </DrawerClose>
  )
}

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
}
