
import { Variants } from 'framer-motion';

/**
 * A collection of animation variants for use with Framer Motion.
 * These variants can be applied to `motion` components to create consistent animations.
 *
 * @property {Variants} fadeIn - A simple fade-in animation.
 * @property {Variants} slideInUp - An animation that slides the element in from the bottom while fading in.
 * @property {Variants} staggerContainer - A container variant used to stagger the animation of its children.
 */
export const animationVariants: { [key: string]: Variants } = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
};
