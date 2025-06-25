import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { forwardRef } from 'react'
import { TouchTarget } from './ModernButton'
import { Link } from 'react-router-dom';

// Helper function to extract initials from user data
function getInitials(surname, lastName, otherName, name) {
  // Priority 1: Use surname and lastName if available
  if (surname && lastName) {
    return (surname[0] + lastName[0]).toUpperCase();
  }
  
  // Priority 2: If name is provided as a single string
  if (name) {
    // Split the name by spaces
    const nameParts = name.split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return '';
    
    // If only one part, take first two letters
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    
    // Otherwise take first letter of first two parts
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
  
  // Priority 3: If only surname or lastName is available
  if (surname) return surname.substring(0, 2).toUpperCase();
  if (lastName) return lastName.substring(0, 2).toUpperCase();
  
  return '';
}

export function Avatar({ 
  src = null, 
  square = false, 
  initials, 
  name,
  surname,
  lastName,
  otherName,
  alt = '', 
  className, 
  ...props 
}) {
  // If initials aren't provided, generate them from name parts
  const displayInitials = initials || getInitials(surname, lastName, otherName, name);
  
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1',
        'outline outline-1 -outline-offset-1 outline-black/[--ring-opacity]',
        // Add the correct border radius
        square ? 'rounded-[--avatar-radius] *:rounded-[--avatar-radius]' : 'rounded-full *:rounded-full'
      )}
    >
      {displayInitials && (
        <svg
          className="size-full select-none fill-current p-[5%] text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text x="50%" y="50%" alignmentBaseline="middle" dominantBaseline="middle" textAnchor="middle" dy=".125em">
            {displayInitials}
          </text>
        </svg>
      )}
      {src && <img className="size-full" src={src} alt={alt} />}
    </span>
  )
}

export const AvatarButton = forwardRef(function AvatarButton(
  { 
    src, 
    square = false, 
    initials, 
    name,
    surname,
    lastName,
    otherName,
    alt, 
    className, 
    ...props 
  },
  ref
) {
  let classes = clsx(
    className,
    square ? 'rounded-[20%]' : 'rounded-full',
    'relative inline-grid focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500'
  )

  return 'href' in props ? (
    <Link {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar 
          src={src} 
          square={square} 
          initials={initials} 
          name={name}
          surname={surname}
          lastName={lastName}
          otherName={otherName}
          alt={alt} 
        />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar 
          src={src} 
          square={square} 
          initials={initials} 
          name={name}
          surname={surname}
          lastName={lastName}
          otherName={otherName}
          alt={alt} 
        />
      </TouchTarget>
    </Headless.Button>
  )
})