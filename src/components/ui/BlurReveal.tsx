import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface BlurRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  className?: string
}

/**
 * Scroll entrance animation inspired by upclose.studio & emilkowal.ski:
 * Transitions smoothly from opacity: 0, blur(10px), y: 15 to crisp focus.
 */
export function BlurReveal({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 15,
  className,
  ...rest
}: BlurRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, filter: 'blur(10px)', y: yOffset }
      }
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, filter: 'blur(0px)', y: 0 }
      }
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -64px 0px' }}
      transition={
        prefersReducedMotion
          ? { duration: 0.15 }
          : {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
