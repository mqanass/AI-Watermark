
import React, { useState } from 'react';
import PromptAnimation from './components/PromptAnimation';
import WatermarkTool from './components/WatermarkTool';
import { AppStage } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('animation');

  return (
    <div className="w-full h-full">
      {stage === 'animation' ? (
        <PromptAnimation onComplete={() => setStage('tool')} />
      ) : (
        <WatermarkTool />
      )}
    </div>
  );
};

export default App;
