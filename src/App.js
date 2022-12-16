import React from 'react';
import { useNfc } from 'use-nfc-hook';

const App = () => {
  const { isNDEFAvailable, permission, read } = useNfc()
  
  // decode an NFC tag containing a single record
  const handleRead = async () => {
    try {
      
      const response = await read()

      const record = response.message.records[0]

      const decoder = new TextDecoder('utf-8');

      const decodedContent = decoder.decode(record.data)

      console.log("DECODED CONTENT:", decodedContent);

    } catch (error) {
      console.log("ERROR ", error);
    }
  }
  
  return (
    <>
      {isNDEFAvailable !== undefined && !isNDEFAvailable && (
        <div>Looks like NDEF is not available</div>
      )}
      {isNDEFAvailable && <button
        onClick={handleRead}
        // disabled={permission as PermissionState === 'denied'}
      >
        Start Scan
      </button>}
    
    
    {permission}
    </>
  );
}
export default App;
