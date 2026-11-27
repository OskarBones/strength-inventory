interface VisibleButtonProps {
  visible: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export default function VisibleButton (
  { visible, onClick, disabled = false }:
    VisibleButtonProps
) {
  return (
    <button
      type='button'
      disabled={disabled}
      className={`
        rounded-sm p-1 text-base enabled:border
        enabled:cursor-pointer enabled:hover:inset-ring
        enabled:active:inset-ring enabled:active:font-bold
        ${visible
      ? 'bg-green dark:bg-green-dark'
      : 'bg-red dark:bg-red-dark'
    }`}
      onClick={onClick}
    >
      {visible
        ? disabled
          ? 'visible'
          : 'visible (click to switch)'
        : disabled
          ? 'hidden'
          : 'hidden (click to switch)'}
    </button>
  );
}
