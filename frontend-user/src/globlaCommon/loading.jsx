import React from 'react';
import { Hourglass } from 'react-loader-spinner';
import { useAppContext } from '../contextApi/context';
const Loading = () => {
  const { store } = useAppContext();
  const isLoadingFromStore = store?.isLoading;
  return (
    <>
      {/* {isLoadingFromStore && isLoadingFromStore.length && ( */}
      {isLoadingFromStore && (
        <div
          className="d-flex justify-content-center"
          style={{
            height: '100vh',
            opacity: 0.8,
            position: 'fixed',
            top: 0,
            zIndex: 1000000,
            width: '100%',
            backgroundColor: '#686767',
          }}
        >
          <Hourglass
            visible={true}
            height="100"
            width="70"
            ariaLabel="hourglass-loading"
            wrapperStyle={{ marginTop: '25rem' }}
            wrapperClass=""
            colors={['rgba(34,69,79,1)', 'rgba(179,220,237,1)']}
          />
        </div>
      )}
    </>
  );
};

export default Loading;
