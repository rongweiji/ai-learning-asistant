import React from 'react'

const PageHeader = ({title,subtitle,children}) => {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
        <p className='text-slate-500'>
          {children}

        </p>
      </div>
    </div>
  )
}

export default PageHeader