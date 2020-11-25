import React from 'react';
import useAxios from 'axios-hooks'
import './App.css';
import SourceView from './SourceView';
import TransformerView from './TransformerView';
import SinkView from './SinkView';

function App() {
  const [{ data, loading, error }, refetch] = useAxios('//localhost:4000')

  if (error) {
    return (
      <>
        <h1>🥳💡 lifx-houseparty</h1>
        <p>Error: Failed to get server state</p>
        <pre><code>{error.stack}</code></pre>
      </>
    );
  }

  if (!data && loading) {
    return (
      <>
        <h1>🥳💡 lifx-houseparty</h1>
        <p>Loading...</p>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <h1>🥳💡 lifx-houseparty</h1>
        <p>Waiting to load...</p>
      </>
    );
  }

  return (
    <>
      <h1>🥳💡 lifx-houseparty</h1>
      <SourceView sources={data.bindingKeys.sources} selected={data.source} refetch={refetch} />
      <TransformerView transformers={data.bindingKeys.transformers} selected={data.transformer} refetch={refetch} />
      <SinkView sinks={data.bindingKeys.sinks} selected={data.sinks} refetch={refetch} />
    </>
  );
}

export default App;
