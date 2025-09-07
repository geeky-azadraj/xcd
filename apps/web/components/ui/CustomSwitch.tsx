import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface CustomSwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

/**
 * CustomSwitch component with consistent styling and checkmark indicator
 * Extends the base Switch component with custom styling and responsive design
 */
export const CustomSwitch = ({
  id,
  checked,
  onCheckedChange,
  className,
}: CustomSwitchProps) => {
  return (
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        // Base styles
        'h-6 w-8',
        // State colors
        'data-[state=checked]:bg-[#258D2B] data-[state=unchecked]:bg-input',
        // Thumb styles
        '[&>span]:h-5 [&>span]:w-5',
        // Thumb position
        '[&>span]:data-[state=checked]:translate-x-2.5',
        // Checkmark styles
        [
          '[&>span]:data-[state=checked]:bg-white',
          "[&>span]:data-[state=checked]:after:content-['✓']",
          '[&>span]:data-[state=checked]:after:font-sans',
          '[&>span]:data-[state=checked]:after:text-[#258D2B]',
          '[&>span]:data-[state=checked]:after:absolute',
          '[&>span]:data-[state=checked]:after:text-[10px]',
          '[&>span]:data-[state=checked]:after:font-medium',
          '[&>span]:data-[state=checked]:after:left-1/2',
          '[&>span]:data-[state=checked]:after:top-1/2',
          '[&>span]:data-[state=checked]:after:-translate-x-1/2',
          '[&>span]:data-[state=checked]:after:-translate-y-1/2',
        ].join(' '),
        className,
      )}
    />
  );
};
