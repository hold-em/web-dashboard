'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/animations/loading.json';

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#10281d]'>
      <div className='relative h-[200px] w-[200px]'>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice',
            progressiveLoad: true
          }}
          initialSegment={[0, 40]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
      </div>
    </div>
  );
}
