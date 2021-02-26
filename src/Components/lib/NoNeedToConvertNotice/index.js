import React from 'react';
import CustomAlert from '../CustomAlert/index.js';

function NoNeedToConvertNotice(props) {
  return (
    <CustomAlert dismissable={true} variant={'info'} heading={''} message={''}>
      <b> You don't need to convert your media before adding it to the app.</b>
      <p>
        <a
          href="https://autoedit.gitbook.io/autoedit-3-user-manual/transcriptions/create-a-new-transcription"
          target="_blank"
          rel="noopener noreferrer"
        >
          see user manual for more details
        </a>
      </p>
    </CustomAlert>
  );
}

export default NoNeedToConvertNotice;
