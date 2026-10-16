import React from 'react'
import { cx } from '@mas/shared'
import './button.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'medium', className, children, ...rest }, ref) => {
    return (
      <button ref={ref} className={cx('mas-btn', `mas-btn--${variant}`, `mas-btn--${size}`, className)} {...rest}>
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
