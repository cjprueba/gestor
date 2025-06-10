import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
        primario: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
        secundario: "border border-button-secondary text-primary-500 hover:bg-primary-50 focus:ring-primary-500",
        terciario: "text-primary-500 hover:text-primary-600 focus:ring-primary-600",
        icono: "bg-primary-500 text-white p-2 hover:bg-primary-600 focus:ring-primary-500",
        iconoSecundario: "text-primary-500 p-2 hover:bg-primary-50 focus:ring-primary-500",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-10 px-4 text-sm",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//   VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
