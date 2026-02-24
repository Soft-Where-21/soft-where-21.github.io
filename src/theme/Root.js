import React from 'react';
import DeveloperDialog from '@site/src/components/DeveloperDialog';

export default function Root({children}) {
  return (
    <>
      {children}
      <DeveloperDialog />
    </>
  );
}
