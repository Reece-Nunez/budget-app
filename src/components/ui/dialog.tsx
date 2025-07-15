'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl focus:outline-none',
        className
      )}
      aria-describedby="dialog-description"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-4 right-4 text-muted-foreground hover:text-black focus:outline-none">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">
    {children}
  </div>
)

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 flex justify-end space-x-2">
    {children}
  </div>
)

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold leading-none tracking-tight">
    {children}
  </h2>
)

export const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p id="dialog-description" className="text-sm text-muted-foreground">
    {children}
  </p>
)
