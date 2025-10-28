import { getNodesBounds, getViewportForBounds, Panel, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1600;
const imageHeight = 1600;

function DownloadButton({ isDisabled }) {
  const { getNodes } = useReactFlow();
  const onClick = async() => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.2, 1.4);
    await new Promise((resolve) => setTimeout(resolve, 200));

    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        transformOrigin: '0 0',
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className="inline-flex h-10 items-center justify-center rounded-full border border-white bg-[#2b7fff] px-4 font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-[#418dff] hover:shadow-md active:bg-[#1a5edb] disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-70"
      >
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;
