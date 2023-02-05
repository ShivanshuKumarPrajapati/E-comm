import Link from 'next/link';
import React from 'react'

const DropdownLink = (props) => {
    
    let { children, href, ...rest } = props;
  return (
      <Link href={ href } {...rest}>{children }</Link>
  )
}

export default DropdownLink