import React from 'react'
import {FileText, Plus} from 'lucide-react'

const EmptyState = ({onActionClick, title, description, buttonText }) => {
  return (
    <div className=''>
        <div>
            <FileText className='mx-auto h-12 w-12 text-neutral-400' />

        </div>
        <h3 className='mt-2 text-center text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='mt-1 text-center text-sm text-gray-500'>{description}</p>
        {onActionClick && buttonText && (
            <div className='mt-4 flex justify-center'>
                <button
                    onClick={onActionClick}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                >
                    <Plus className='-ml-1 mr-2 h-5 w-5' aria-hidden="true" />
                    {buttonText}
                </button>
            </div>
        )}
    </div>
  )
}

export default EmptyState