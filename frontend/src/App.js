import React from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of file list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📁 File Manager</h1>
        <p>Upload and manage your PDF files and images</p>
      </header>
      
      <main className="App-main">
        <section className="upload-section">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </section>
        
        <section className="files-section">
          <FileList refreshTrigger={refreshTrigger} />
        </section>
      </main>
    </div>
  );
}

export default App;
