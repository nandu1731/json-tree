import Header from '@/components/header';
import '@xyflow/react/dist/style.css';
import JsonTreeLayout from '@/components/jsonTreeLayout';
import { ReactFlowProvider } from '@xyflow/react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="bg-white p-8">
        <Header />
        <ReactFlowProvider>
          <JsonTreeLayout />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
