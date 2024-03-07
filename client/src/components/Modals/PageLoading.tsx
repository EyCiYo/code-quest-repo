import React from 'react';

type PageLoadingProps = {
    
};

const PageLoading:React.FC<PageLoadingProps> = () => {
    
    return (
        <div className='flex space-x-2 justify-center items-center bg-dark-layer-2 h-screen'>
            <span className='sr-only'>Loading...</span>
            <div className='h-8 w-8 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-green-600 rounded-full animate-bounce'></div>
        </div>
    )
}
export default PageLoading;