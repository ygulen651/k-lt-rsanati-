import { cn } from "@/lib/utils"
import { Container } from "./Container"

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  background?: 'default' | 'muted' | 'accent'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Section({ 
  children, 
  className,
  containerSize = 'xl',
  background = 'default',
  padding = 'lg'
}: SectionProps) {
  const backgroundClasses = {
    default: '',
    muted: 'bg-muted/30',
    accent: 'bg-primary/5'
  }

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  }

  return (
    <section className={cn(
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  )
}
